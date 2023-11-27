"use client";

import React from "react";
import { Spinner } from "@nextui-org/react";
import { addCorp, getCdsGroups } from "@/actions/action";
import { useFormState, useFormStatus } from "react-dom";
import useSWR from "swr";
import { cdsGroupInterface } from "@/types";
import toast from "react-hot-toast";

interface AddCorpMemberFormProps {
  modalStatus: boolean;
  handleModal: () => void;
}

export const AddCorpMemberForm: React.FC<AddCorpMemberFormProps> = ({
  modalStatus: isOpen,
  handleModal: onOpenChange,
}) => {
  const [state, formAction] = useFormState(addCorp, {
    message: "",
    success: false,
  });

  if (state.success) {
    toast.success(state.message);
    onOpenChange();
  } else if (state.message !== "") {
    toast.error(state.message);
  }

  const { data } = useSWR("/dashboard/add", getCdsGroups);
  let pending = false;
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
              Add Product
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="University"
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
