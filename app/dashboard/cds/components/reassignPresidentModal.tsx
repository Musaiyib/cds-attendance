"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { CorpInterface, cdsGroupInterface } from "@/types";
import { FindCDSPresident, searchCorp } from "@/app/lib/utils";
import { log } from "console";
import { TbStatusChange } from "react-icons/tb";
import { updateCDSPresident } from "@/actions/action";

interface ChangeCDSPresident {
  modalStatus: boolean;
  handleModal: () => void;
  cdsGroup: cdsGroupInterface;
}

export const ReassignPresidentModal: React.FC<ChangeCDSPresident> = ({
  modalStatus,
  handleModal,
  cdsGroup,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<CorpInterface[]>([]);
  const [selectedCorp, setSelectedCorp] = useState<CorpInterface>({
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
    role: "",
    email: "",
    password: "",
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCloseModal = useCallback(() => {
    onClose();
    handleModal();
    // setCdsGroupName("");
  }, [handleModal, onClose]);
  useEffect(() => {
    const corps =
      cdsGroup && searchCorp(cdsGroup.corps as CorpInterface[], searchTerm);
    setSearchResult(corps);
  }, [searchTerm, cdsGroup]);
  useEffect(() => {
    modalStatus ? onOpen() : handleCloseModal();
  }, [modalStatus, handleCloseModal, onOpen]);
  useEffect(() => {
    const cdsPresident =
      cdsGroup && FindCDSPresident(cdsGroup.corps as CorpInterface[]);
    setSelectedCorp(cdsPresident);
  }, [onOpen, cdsGroup]);

  const handleChangePresident = async () => {
    console.log(selectedCorp);

    try {
      if (!selectedCorp.email || !selectedCorp.password) {
        toast.error("email and password field are required");
        return;
      }
      const res = await updateCDSPresident(
        cdsGroup && FindCDSPresident(cdsGroup.corps as CorpInterface[]).id,
        selectedCorp?.id,
        selectedCorp?.email,
        selectedCorp?.password
      );
      if (res.code === 200) {
        toast.success(res.message);
        handleCloseModal();
      } else if (res.code === 400) {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update cds group president");
    }
  };

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={handleCloseModal}
      backdrop="opaque"
      className="bg-gray-800"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change CDS president
            </ModalHeader>
            <ModalBody>
              <div className="bg-gray-800 rounded-lg text-left">
                <h4>Current president info</h4>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={
                        cdsGroup &&
                        FindCDSPresident(cdsGroup.corps as CorpInterface[])
                          ?.fullName
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Name"
                      disabled
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
                      value={
                        cdsGroup &&
                        FindCDSPresident(cdsGroup.corps as CorpInterface[])
                          ?.stateCode
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="State code"
                      disabled
                    />
                  </div>
                </div>
              </div>
              {selectedCorp && (
                <div className="bg-gray-800 rounded-lg text-left">
                  <h4>New president info</h4>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="Email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={selectedCorp ? selectedCorp.email : ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSelectedCorp((prevCorp) => ({
                            ...(prevCorp || {}),
                            email: e.target.value,
                          }))
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type="text"
                        name="password"
                        id="password"
                        value={selectedCorp ? selectedCorp.password : ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSelectedCorp((prevCorp) => ({
                            ...(prevCorp || {}),
                            password: e.target.value,
                          }))
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="State code"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label
                  htmlFor="Search"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Search
                </label>
                <input
                  type="text"
                  name="Search"
                  id="Search"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="New president name or state code"
                  required
                />
              </div>
              {searchResult && (
                <div className="flex flex-col sm:p-2 bg-gray-700 rounded-xl">
                  {searchResult.slice(0, 5).map((corp) => (
                    <div
                      key={corp.id}
                      className={`flex flex-row justify-between h-10 m-1 px-2 rounded-xl items-center ${
                        selectedCorp && corp.id === selectedCorp.id
                          ? "bg-green-700"
                          : "bg-gray-800"
                      }`}
                      onClick={() => setSelectedCorp(corp)}
                    >
                      <p>{corp.fullName}</p>
                      <p>{corp.stateCode}</p>
                    </div>
                  ))}
                </div>
              )}
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
                onPress={handleChangePresident}
              >
                {/* {pending ? (
                  <>
                    <Spinner />
                  </>
                ) : ( */}
                <>
                  <TbStatusChange className="-ml-1 mr-1.5 w-5 h-5" />
                  Change president
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
