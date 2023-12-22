import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cdsGroupInterface } from "@/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { deleteCdsGroup } from "@/actions/action";
import toast from "react-hot-toast";
import { AddCdsGroupForm } from "@/components/addCdsGroupModal";
import { FindCDSPresident } from "@/app/lib/utils";

interface CdsGroupCardProps {
  cdsGroup: cdsGroupInterface;
}

const CdsGroupCard: React.FC<CdsGroupCardProps> = ({ cdsGroup }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOpen = () => {
    onOpen();
    toggleOptions();
  };

  const handleEdit = () => {
    setIsModalOpen(true);
    toggleOptions();
  };

  const handleDelete = async (cdsGroupId: string) => {
    if (!cdsGroupId) return;
    try {
      const res = await deleteCdsGroup(cdsGroupId);
      if (res.code === 200) {
        toast.success(res.message);
      } else if (res.code === 400) {
        toast.error(res.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleModal = () => {
    setIsModalOpen(false);
  };

  const cdsPresident = FindCDSPresident(cdsGroup);

  return (
    <>
      <AddCdsGroupForm
        cdsGroup={cdsGroup}
        modalStatus={isModalOpen}
        handleModal={handleModal}
      />
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:scale-[1.02]">
        <div className="flex relative justify-between items-center mb-5 text-gray-500">
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
          <span className="text-sm">
            <button
              id="apple-imac-27-dropdown-button"
              data-dropdown-toggle="apple-imac-27-dropdown"
              className="inline-flex rotate-90 items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
              type="button"
              onClick={toggleOptions}
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
            {showOptions && (
              <div
                ref={dropdownRef}
                className="absolute z-10 right-4 mt-0 bg-gray-300 rounded-md text-sm"
              >
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-700 rounded-t-md"
                  onClick={handleEdit}
                >
                  Edit
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-700 rounded-b-md"
                  onClick={handleOpen}
                >
                  Delete
                </div>
              </div>
            )}
          </span>
        </div>
        <Link href={`/dashboard/cds/${cdsGroup.id}`}>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {cdsGroup.name}
          </h2>

          <p className="my-1 text-lg">
            <span className="mr-1 font-bold">Total corps:</span>
            {cdsGroup.corps?.length}
          </p>

          <div className="p-2 rounded-lg border-[0.5px] border-gray-700 mt-2 mb-3">
            <h6 className="text-md font-bold mb-2">Total amount generated:</h6>
            <p className="my-1 text-sm">
              <span className="mr-1 font-bold">Legacy fee:</span>
              {cdsGroup.legacyFee}
            </p>
            <p className="my-1 text-sm">
              <span className="mr-1 font-bold">Weekly dues:</span>₦
              {cdsGroup.amountPaid}
            </p>
          </div>
          <div className="w-full">
            {cdsPresident ? (
              <div className="flex flex-row justify-between items-left">
                <div className="">
                  <p className="text-sm">{cdsPresident?.fullName}</p>
                  <p className="text-sm">{cdsPresident?.phone}</p>
                </div>
                <p className="flex justify-center items-center text-sm p-[1px] pb-1 bg-blue-500 rounded-lg max-w-max px-2 mt-1">
                  President
                </p>
              </div>
            ) : (
              <p className="text-red-700">
                No corp member added to this cds group yet
              </p>
            )}
          </div>
        </Link>
      </div>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onClose={onClose}
        className="bg-gray-800"
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete {cdsGroup.name}?
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete{" "}
                  <span className="text-red-700">{cdsGroup.name}</span>?
                </p>
                <p>
                  Deleting this will also delete all the cds member from the
                  database.
                </p>
                <p>
                  Advisably, Make sure you change there cds group first before
                  deleting the cds group
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-red-700"
                  onPress={() => {
                    handleDelete(cdsGroup.id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
                <Button className="bg-blue-700" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CdsGroupCard;
