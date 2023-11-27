"use client";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { AddCdsGroupForm } from "@/components/addCdsGroupModal";
import { useState } from "react";
import { getCdsGroups } from "@/actions/action";
import useSWR from "swr";
import { Spinner } from "@nextui-org/react";
import { cdsGroupInterface } from "@/types";

export default function add() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, isLoading, error } = useSWR("/dashboard/add", getCdsGroups);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <section className="w-full h-full flex flex-row px-2 pt-2 ">
      <div className="flex-auto bg-gray-800 rounded-t-lg mt-2 light:bg-gray-50">
        {isModalOpen && (
          <AddCdsGroupForm
            modalStatus={isModalOpen}
            handleModal={handleModal}
          />
        )}
        <div className="h-full w-full">
          <div className="bg-white dark:bg-gray-800 h-full relative shadow-md sm:rounded-lg overflow-hidden overflow-y-scroll text-start">
            <div className="flex justify-between align-center py-5 px-3">
              <h1 className="justify-self-start align-top font-bold text-2xl">
                CDS Groups
              </h1>
              <button
                type="button"
                onClick={handleModal}
                className="flex flex-row text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                <LuPlus className="w-5 h-5 mr-2" />
                Add CDS Group
              </button>
            </div>
            <div className="py-8 px-4 lg:py-16 lg:px-6">
              <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {Array.isArray(data) &&
                  data.map(
                    (cdsGroup: cdsGroupInterface, groupIndex: number) => (
                      <div
                        key={groupIndex}
                        className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:scale-[1.02]"
                      >
                        <div className="flex justify-between items-center mb-5 text-gray-500">
                          <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                            <svg
                              className="mr-1 w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                            </svg>
                            Tutorial
                          </span>
                          <span className="text-sm">14 days ago</span>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          <a href={`/dashboard/cds/${cdsGroup.id}`}>
                            {cdsGroup.name}
                          </a>
                        </h2>

                        <p className="my-1 text-lg">
                          <span className="mr-1 font-bold">Total corps:</span>
                          {cdsGroup.corps?.length}
                        </p>

                        <div className="p-2 rounded-lg border-[0.5px] border-gray-700 mt-2 mb-3">
                          <h6 className="text-md font-bold mb-2">
                            Total amount generated:
                          </h6>
                          <p className="my-1 text-sm">
                            <span className="mr-1 font-bold">Legacy fee:</span>₦
                            {cdsGroup.amountPaid}
                          </p>
                          <p className="my-1 text-sm">
                            <span className="mr-1 font-bold">
                              Monthly dues:
                            </span>
                            ₦{cdsGroup.amountPaid}
                          </p>
                        </div>
                        <div className="w-full">
                          <div className="flex flex-col items-left">
                            <p className="text-sm">Musaiyib Yakubu Usman</p>
                            <p className="flex justify-center align-center text-sm p-[1px] pb-1 bg-blue-500 rounded-lg max-w-max px-2 mt-1">
                              President
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
            {!data &&
              (isLoading ? (
                <div className="text-center">
                  <Spinner />
                </div>
              ) : (
                <p className="my-10 text-center">No corp member added yet</p>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
