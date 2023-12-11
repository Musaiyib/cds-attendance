"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { addCorp, getCdsGroups } from "@/actions/action";
import useSWR from "swr";
import { CorpInterface, cdsGroupInterface } from "@/types";
import toast from "react-hot-toast";
interface AddCorpMemberFormProps {
  modalStatus: boolean;
  handleModal: () => void;
  corpData?: CorpInterface;
}

export const AddCorpMemberForm: React.FC<AddCorpMemberFormProps> = ({
  modalStatus,
  handleModal,
  corpData,
}) => {
  const [newCorpData, setNewCorpData] = useState<CorpInterface>({
    id: corpData?.id || "",
    fullName: corpData?.fullName || "",
    stateCode: corpData?.stateCode || "",
    cdsGroup: corpData?.cdsGroup || "",
    cdsGroupId: corpData?.cdsGroupId || "",
    ppa: corpData?.ppa || "",
    state: corpData?.state || "",
    university: corpData?.university || "",
    course: corpData?.course || "",
    phone: corpData?.phone || "",
    attendance: corpData?.attendance || {
      week1: false,
      week2: false,
      week3: false,
      week4: false,
    },
    legacyFee: corpData?.legacyFee || false,
    weeklyDues: corpData?.weeklyDues || 0,
    createdAt: corpData?.createdAt || new Date(),
    updatedAt: corpData?.updatedAt || new Date(),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCloseModal = useCallback(() => {
    onClose();
    handleModal();
    setNewCorpData({
      id: "",
      fullName: "",
      stateCode: "",
      cdsGroup: "",
      cdsGroupId: "",
      ppa: "",
      state: "",
      university: "",
      course: "",
      phone: "",
      attendance: {
        week1: false,
        week2: false,
        week3: false,
        week4: false,
      },
      legacyFee: false,
      weeklyDues: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }, []);
  useEffect(() => {
    modalStatus ? onOpen() : handleCloseModal();
  }, [modalStatus, handleCloseModal, onOpen]);

  const handleAddCorp = async () => {
    const {
      id,
      weeklyDues,
      legacyFee,
      cdsGroup,
      attendance,
      createdAt,
      updatedAt,
      ...rest
    } = newCorpData;

    const isEmpty = (value: any) =>
      value === "" ||
      (typeof value === "object" &&
        Object.values(value).some((innerValue) => innerValue === ""));

    if (Object.values(rest).some((value) => isEmpty(value))) {
      toast.error("Some fields are empty");
    } else {
      try {
        const res = await addCorp(newCorpData, corpData?.id);
        if (res.code === 200) {
          toast.success(res.message);
          handleCloseModal();
        } else if (res.code === 400) {
          toast.error(res.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to add corp");
      }
    }
  };

  const { data } = useSWR("/dashboard/add", getCdsGroups);

  return (
    <Modal
      size="4xl"
      isOpen={isOpen}
      onClose={handleCloseModal}
      backdrop="opaque"
      className="bg-gray-800"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modal Title
            </ModalHeader>
            <ModalBody>
              <div className="p-2 bg-gray-800 rounded-lg mb-2 text-left">
                <h4>Info section #1</h4>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Full name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={newCorpData?.fullName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCorpData((prevValue) => ({
                          ...prevValue,
                          fullName: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type corp full name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="stateCode"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      State code
                    </label>
                    <input
                      type="text"
                      name="stateCode"
                      id="stateCode"
                      value={newCorpData?.stateCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCorpData((prevValue) => ({
                          ...prevValue,
                          stateCode: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="State code"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ppa"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      PPA
                    </label>
                    <input
                      type="text"
                      name="ppa"
                      id="ppa"
                      value={newCorpData?.ppa}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCorpData((prevValue) => ({
                          ...prevValue,
                          ppa: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Place of primary assignment"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cdsGroup"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      CDS group
                    </label>
                    <select
                      id="cdsGroup"
                      name="cdsGroup"
                      value={newCorpData?.cdsGroupId || ""}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewCorpData((prevValue) => ({
                          ...prevValue,
                          cdsGroupId: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="">Select CDS group</option>
                      {Array.isArray(data) &&
                        data.map((cdsGroup: cdsGroupInterface) => (
                          <option key={cdsGroup.id} value={cdsGroup.id}>
                            {cdsGroup.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-gray-800 rounded-lg mb-2 text-left">
                <h4>Info section #2</h4>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={newCorpData?.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCorpData((prevValue) => ({
                          ...prevValue,
                          phone: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type corp phone number"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      State of origin
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={newCorpData?.state}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCorpData((prevValue) => ({
                          ...prevValue,
                          state: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type corp state of origin"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="course"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Course of study
                    </label>
                    <input
                      type="text"
                      name="course"
                      id="course"
                      value={newCorpData?.course}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCorpData((prevValue) => ({
                          ...prevValue,
                          course: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Course of study"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="university"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      University
                    </label>
                    <input
                      type="text"
                      name="university"
                      id="university"
                      value={newCorpData?.university}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCorpData((prevValue) => ({
                          ...prevValue,
                          university: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="University"
                      required
                    />
                  </div>
                </div>
              </div>
              <button></button>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleCloseModal}>
                Close
              </Button>
              <Button
                type="button"
                // disabled={pending}
                className="text-white inline-flex items-center text-right bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                color="primary"
                onPress={handleAddCorp}
              >
                {/* {pending ? (
                  <>
                    <Spinner />
                  </>
                ) : ( */}
                <>
                  <svg
                    className="mr-1 -ml-1 w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Add new corp
                </>
                {/* )} */}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
