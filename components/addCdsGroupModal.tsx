"use client";

import React from "react";
import { Spinner } from "@nextui-org/react";
import { addCDS } from "@/actions/action";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

interface AddCdsGroupFormProps {
  modalStatus: boolean;
  handleModal: () => void;
}

export const AddCdsGroupForm: React.FC<AddCdsGroupFormProps> = ({
  modalStatus: isOpen,
  handleModal: onOpenChange,
}) => {
  const [state, formAction] = useFormState(addCDS, {
    message: "",
    success: false,
  });
  let pending = false;

  if (state?.success) {
    toast.success(state.message);
    onOpenChange();
  } else if (state && state?.message !== "") {
    toast.error(state?.message);
  }

  return (
    <div
      aria-hidden="true"
      className={`${
        isOpen ? "flex" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full md:h-full`}
    >
      <div
        className="absolute h-full md:h-full bg-gray-900 bg-opacity-70 w-full"
        onClick={onOpenChange}
      />
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-700 sm:p-5 mt-6 mb-8">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Cds Group
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
              onClick={onOpenChange}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form action={formAction} id="form">
            <div className="p-2 bg-gray-800 rounded-lg mb-2 text-left">
              <h4>Info section #1</h4>
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type cds group name"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="text-white inline-flex items-center text-right bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {pending ? (
                <>
                  <Spinner />
                  Loading...
                </>
              ) : (
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
                  Add new product
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
