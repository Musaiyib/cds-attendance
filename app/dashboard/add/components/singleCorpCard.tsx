import { deleteCorpMember } from "@/actions/action";
import { calculateAttendance } from "@/app/lib/utils";
import { AddCorpMemberForm } from "@/components/addMemberModal";
import { CorpInterface } from "@/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const SingleCorpCard = ({ corp }: { corp: CorpInterface }) => {
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
    toggleOptions();
    setIsModalOpen(true);
  };
  const handleModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (cdsGroupId: string) => {
    if (!cdsGroupId) return;
    try {
      const res = await deleteCorpMember(cdsGroupId);
      if (res.code === 200) {
        toast.success(res.message);
      } else if (res.code === 400) {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete corp member");
    }
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

  return (
    <>
      {isModalOpen && (
        <AddCorpMemberForm
          corpData={corp}
          modalStatus={isModalOpen}
          handleModal={handleModal}
        />
      )}
      <tr className="border-b dark:border-gray-700" key={corp.id}>
        <th
          scope="row"
          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {corp.fullName}
        </th>
        <td className="px-4 py-3">{corp.stateCode}</td>
        <td className="px-4 py-3">{corp.phone}</td>
        <td className="px-4 py-3">
          {`${calculateAttendance(corp.attendance)}%`}
        </td>
        <td className="px-4 py-3">{corp.ppa}</td>
        <td className="px-4 py-3 flex items-center justify-end">
          <button
            id="apple-imac-27-dropdown-button"
            data-dropdown-toggle="apple-imac-27-dropdown"
            className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
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
              className="absolute z-10 right-14 mt-20 bg-gray-300 rounded-md text-sm"
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
        </td>
      </tr>
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
                Delete {corp.fullName}?
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete{" "}
                  <span className="text-red-700">{corp.fullName}</span> with
                  state code{" "}
                  <span className="text-red-700">{corp.stateCode}</span>?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-red-700"
                  onPress={() => {
                    handleDelete(corp.id);
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

export default SingleCorpCard;
