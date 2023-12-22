"use client";
import {
  getSingleCdsGroup,
  updateLegacyFee,
  updateWeeklyDues,
} from "@/actions/action";
import { CorpInterface, cdsGroupInterface } from "@/types";
import useSWR from "swr";
import { Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useState } from "react";
import { calculateAttendance } from "@/app/lib/utils";
import { LuRedoDot } from "react-icons/lu";
import { ReassignPresidentModal } from "../components/reassignPresidentModal";
import { TbStatusChange } from "react-icons/tb";

interface corpAmount {
  corpId: string;
  amount: number;
  legacy: boolean;
}

export default function SingleCdsGroup({
  params: { id },
}: {
  params: { id: string };
}) {
  const [corpsAmt, setCorpsAmt] = useState<corpAmount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isWeeklyDuesLoading, setIsWeeklyDuesLoading] =
    useState<boolean>(false);
  const [isLegacyLoading, setIsLegacyLoading] = useState<boolean>(false);
  const { data, isLoading, error } = useSWR<
    cdsGroupInterface | { message: string; code: number }
  >("/dashboard/attendance/mark", () => getSingleCdsGroup(id));

  if (error) {
    toast.error(error.message);
  }

  const handleLegacyFee = async ({
    id,
    cdsId,
    amount,
  }: {
    id: string;
    cdsId: string;
    amount: number;
  }) => {
    if (!id) return;
    if (isLegacyLoading) return;

    const index = corpsAmt.findIndex((item) => item.corpId === id);

    if (index >= 0) {
      if (corpsAmt[index].legacy === true) {
        toast.error("Legacy fee is already marked paid");
        return;
      }
    }

    try {
      setIsLegacyLoading(true);
      const res = await updateLegacyFee(id, cdsId);

      if (res.code === 200) {
        toast.success(res.message);
      } else if (res.code === 400) {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update legacy fee");
    } finally {
      setCorpsAmt((prevValue) => {
        const existingCorp = prevValue.find((corp) => corp.corpId === id);

        if (existingCorp) {
          const updatedCorpsAmt = prevValue.map((corp) => {
            if (corp.corpId === id) {
              return {
                ...corp,
                legacy: true,
              };
            }
            return corp;
          });

          return updatedCorpsAmt;
        } else {
          return [
            ...prevValue,
            {
              corpId: id,
              amount,
              legacy: true,
            },
          ];
        }
      });
      setIsLegacyLoading(false);
    }
  };

  const handleWeeklyDues = async ({
    id,
    cdsId,
    action,
    amount,
    legacy,
  }: {
    id: string;
    cdsId: string;
    action: number;
    amount: number;
    legacy: boolean;
  }) => {
    const index = corpsAmt.findIndex((item) => item.corpId === id);

    if (isWeeklyDuesLoading) return;
    if (!id) return;

    if (index >= 0) {
      if (
        (action === 1 && corpsAmt[index].amount >= 200) ||
        (action === 0 && corpsAmt[index].amount === 0)
      ) {
        toast.error("Weekly dues amount must be between ₦0 to ₦200");
        return;
      }
    }
    if (index === -1) {
      if ((action === 1 && amount >= 200) || (action === 0 && amount === 0)) {
        toast.error("Weekly dues amount must be between ₦0 to ₦200");
        return;
      }
    }

    try {
      setIsWeeklyDuesLoading(true);
      const res = await updateWeeklyDues(id, cdsId, action);

      if (res.code === 200) {
        toast.success(res.message);
      } else if (res.code === 400) {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update legacy fee");
    } finally {
      setCorpsAmt((prevValue) => {
        const existingCorp = prevValue.find((corp) => corp.corpId === id);

        if (existingCorp) {
          const updatedCorpsAmt = prevValue.map((corp) => {
            if (corp.corpId === id) {
              return {
                ...corp,
                amount: action === 1 ? corp.amount + 50 : corp.amount - 50,
              };
            }
            return corp;
          });

          return updatedCorpsAmt;
        } else {
          return [
            ...prevValue,
            {
              corpId: id,
              amount: action === 1 ? amount + 50 : amount - 50,
              legacy,
            },
          ];
        }
      });
      setIsWeeklyDuesLoading(false);
    }
  };

  const handleModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="w-full h-full flex flex-row lg:px-2">
      <div className="flex-auto bg-gray-800 rounded-t-lg mt-2 light:bg-gray-50">
        <ReassignPresidentModal
          modalStatus={isModalOpen}
          handleModal={handleModal}
          cdsGroup={data as cdsGroupInterface}
        />
        <div className="h-full w-full">
          <div className="bg-white dark:bg-gray-800 h-full relative shadow-md sm:rounded-lg overflow-hidden overflow-y-scroll text-start mx-2">
            {isLoading ? (
              <div className="my-10 text-center">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="flex justify-center flex-col align-center p-3 pt-6">
                  <h1 className="flex justify-center align-center font-bold text-2xl">
                    {typeof data === "object" && "name" in data && data.name}
                  </h1>
                  <p className="justify-center align-center flex text-md">
                    Total corp members:
                    {data && "corps" in data && data.corps ? (
                      <span className="ml-2 font-bold">
                        {data.corps.length}{" "}
                      </span>
                    ) : (
                      <Spinner />
                    )}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                      <label htmlFor="simple-search" className="sr-only">
                        Search
                      </label>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="simple-search"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Search"
                          required
                        />
                      </div>
                    </form>
                  </div>
                  <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                      <button
                        className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700"
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <TbStatusChange className="-ml-1 mr-1.5 w-5 h-5" />
                        Reassign president
                      </button>
                      <button
                        id="actionsDropdownButton"
                        data-dropdown-toggle="actionsDropdown"
                        className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        type="button"
                      >
                        <svg
                          className="-ml-1 mr-1.5 w-5 h-5"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          />
                        </svg>
                        Actions
                      </button>
                      <div
                        id="actionsDropdown"
                        className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                      >
                        <ul
                          className="py-1 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="actionsDropdownButton"
                        >
                          <li>
                            <a
                              href="#"
                              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Mass Edit
                            </a>
                          </li>
                        </ul>
                        <div className="py-1">
                          <a
                            href="#"
                            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Delete all
                          </a>
                        </div>
                      </div>
                      <button
                        id="filterDropdownButton"
                        data-dropdown-toggle="filterDropdown"
                        className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="h-4 w-4 mr-2 text-gray-400"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Filter
                        <svg
                          className="-mr-1 ml-1.5 w-5 h-5"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          />
                        </svg>
                      </button>
                      <div
                        id="filterDropdown"
                        className="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
                      >
                        <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                          Choose brand
                        </h6>
                        <ul
                          className="space-y-2 text-sm"
                          aria-labelledby="filterDropdownButton"
                        >
                          <li className="flex items-center">
                            <input
                              id="apple"
                              type="checkbox"
                              value=""
                              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="apple"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                              Apple (56)
                            </label>
                          </li>
                          <li className="flex items-center">
                            <input
                              id="fitbit"
                              type="checkbox"
                              value=""
                              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="fitbit"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                              Microsoft (16)
                            </label>
                          </li>
                          <li className="flex items-center">
                            <input
                              id="razor"
                              type="checkbox"
                              value=""
                              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="razor"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                              Razor (49)
                            </label>
                          </li>
                          <li className="flex items-center">
                            <input
                              id="nikon"
                              type="checkbox"
                              value=""
                              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="nikon"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                              Nikon (12)
                            </label>
                          </li>
                          <li className="flex items-center">
                            <input
                              id="benq"
                              type="checkbox"
                              value=""
                              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="benq"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                              BenQ (74)
                            </label>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          Corp name
                        </th>
                        <th scope="col" className="px-4 py-3">
                          State code
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Attendance
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Legacy Fee
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Weekly Dues
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data &&
                        "corps" in data &&
                        Array.isArray(data.corps) &&
                        (data.corps as CorpInterface[]).map(
                          (corp: CorpInterface) => (
                            <tr
                              className="border-b dark:border-gray-700"
                              key={corp.id}
                            >
                              <th
                                scope="row"
                                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                {corp.fullName}
                              </th>
                              <td className="px-4 py-3">{corp.stateCode}</td>
                              <td className="px-4 py-3">
                                {`${calculateAttendance(corp.attendance)}%`}
                              </td>
                              <td className="px-4 py-3 ">
                                <button
                                  type="button"
                                  className={`${
                                    corpsAmt &&
                                    corpsAmt.length > 0 &&
                                    corpsAmt.find(
                                      (item) => item.corpId === corp.id
                                    )
                                      ? `${
                                          corpsAmt.find(
                                            (item) => item.corpId === corp.id
                                          )!.legacy
                                            ? "bg-green-700"
                                            : "bg-red-700"
                                        }`
                                      : `${
                                          corp.legacyFee
                                            ? "bg-green-700"
                                            : "bg-red-700"
                                        }`
                                  }
                                  } text-center p-2 rounded-lg w-20`}
                                  onClick={() => {
                                    corp.legacyFee !== true
                                      ? handleLegacyFee({
                                          id: corp.id,
                                          cdsId: corp.cdsGroupId,
                                          amount: corp.weeklyDues,
                                        })
                                      : toast("Legacy fee is already paid", {
                                          icon: (
                                            <IoMdInformationCircleOutline className="scale-125 text-blue-600" />
                                          ),
                                        });
                                  }}
                                >
                                  {corpsAmt &&
                                  corpsAmt.length > 0 &&
                                  corpsAmt.find(
                                    (item) => item.corpId === corp.id
                                  )
                                    ? `${
                                        corpsAmt.find(
                                          (item) => item.corpId === corp.id
                                        )!.legacy
                                          ? "Paid"
                                          : "Not paid"
                                      }`
                                    : `${corp.legacyFee ? "Paid" : "Not paid"}`}
                                </button>
                              </td>
                              <td className="px-4 py-3 justify-between flex-row">
                                <div className="justify-around flex flex-row">
                                  <button
                                    type="button"
                                    className="bg-red-700 rounded-lg flex items-center justify-center w-6 h-6"
                                    disabled={isWeeklyDuesLoading}
                                    onClick={() => {
                                      handleWeeklyDues({
                                        id: corp.id,
                                        cdsId: corp.cdsGroupId,
                                        action: 0,
                                        amount: corp.weeklyDues,
                                        legacy: corp.legacyFee,
                                      });
                                    }}
                                  >
                                    <FiMinus className="w-6 h-6" />
                                  </button>
                                  <p>
                                    {corpsAmt &&
                                    corpsAmt.length > 0 &&
                                    corpsAmt.find(
                                      (item) => item.corpId === corp.id
                                    )
                                      ? `₦${
                                          corpsAmt.find(
                                            (item) => item.corpId === corp.id
                                          )!.amount
                                        }`
                                      : `₦${corp.weeklyDues}`}
                                  </p>
                                  <button
                                    type="button"
                                    className="bg-green-700 rounded-lg flex items-center justify-center w-6 h-6"
                                    disabled={isWeeklyDuesLoading}
                                    onClick={() => {
                                      handleWeeklyDues({
                                        id: corp.id,
                                        cdsId: corp.cdsGroupId,
                                        action: 1,
                                        amount: corp.weeklyDues,
                                        legacy: corp.legacyFee,
                                      });
                                    }}
                                  >
                                    <FiPlus className="w-6 h-6" />
                                  </button>
                                </div>
                              </td>

                              <td className="px-4 py-3 flex items-center justify-end">
                                <button
                                  id="apple-imac-27-dropdown-button"
                                  data-dropdown-toggle="apple-imac-27-dropdown"
                                  className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                  type="button"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                  </svg>
                                </button>
                                <div
                                  id="apple-imac-27-dropdown"
                                  className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                >
                                  <ul
                                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="apple-imac-27-dropdown-button"
                                  >
                                    <li>
                                      <a
                                        href="#"
                                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                      >
                                        Show
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                      >
                                        Edit
                                      </a>
                                    </li>
                                  </ul>
                                  <div className="py-1">
                                    <a
                                      href="#"
                                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    >
                                      Delete
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
                {data &&
                "corps" in data &&
                Array.isArray(data.corps) &&
                (data.corps as CorpInterface[]).length > 0 ? (
                  <nav
                    className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                    aria-label="Table navigation"
                  >
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Showing
                      <span className="font-semibold text-gray-900 dark:text-white mx-1">
                        1-10
                      </span>
                      of
                      <span className="font-semibold text-gray-900 dark:text-white mx-1">
                        1000
                      </span>
                    </span>
                    <ul className="inline-flex items-stretch -space-x-px">
                      <li>
                        <a
                          href="#"
                          className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          1
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          2
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          aria-current="page"
                          className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        >
                          3
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          ...
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          100
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </nav>
                ) : (
                  <p className="my-10 text-center">
                    No corp member added yet to this group
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
