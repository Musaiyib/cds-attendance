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
import { addCDS } from "@/actions/action";
import toast from "react-hot-toast";
import { cdsGroupInterface } from "@/types";

interface AddCdsGroupFormProps {
  modalStatus: boolean;
  handleModal: () => void;
  cdsGroup?: cdsGroupInterface;
}

export const AddCdsGroupForm: React.FC<AddCdsGroupFormProps> = ({
  modalStatus,
  handleModal,
  cdsGroup,
}) => {
  const [cdsGroupName, setCdsGroupName] = useState<string>(
    (cdsGroup && cdsGroup.name) || ""
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCloseModal = useCallback(() => {
    onClose();
    handleModal();
    setCdsGroupName("");
  }, [handleModal, onClose]);
  useEffect(() => {
    modalStatus ? onOpen() : handleCloseModal();
  }, [modalStatus, handleCloseModal, onOpen]);

  const handleAddCdsGroup = async () => {
    const isEmpty = (value: any) =>
      value === "" ||
      (typeof value === "object" &&
        Object.values(value).some((innerValue) => innerValue === ""));

    if (
      cdsGroupName === "" ||
      cdsGroupName === undefined ||
      cdsGroupName === null
    ) {
      toast.error("Cds group name can't be empty");
    } else {
      try {
        const res = await addCDS(cdsGroupName, cdsGroup?.id);
        if (res.code === 200) {
          toast.success(res.message);
          handleCloseModal();
        } else if (res.code === 400) {
          toast.error(res.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to add cds group");
      }
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
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add Cds Group
            </ModalHeader>
            <ModalBody>
              <div className="bg-gray-800 rounded-lg text-left">
                <div className="w-full">
                  <div className="bg-gray-800 rounded-lg text-left">
                    <div className="">
                      <div>
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Cds group name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={cdsGroupName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setCdsGroupName(e.target.value)
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type cds group name"
                          required
                        />
                      </div>
                    </div>
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
                onPress={handleAddCdsGroup}
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
                  Add Cds Group
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
