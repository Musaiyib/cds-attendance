"use client";
import { LuPlus } from "react-icons/lu";
import { AddCdsGroupForm } from "@/components/addCdsGroupModal";
import { useState } from "react";
import { getCdsGroups } from "@/actions/action";
import useSWR from "swr";
import { Spinner } from "@nextui-org/react";
import { cdsGroupInterface } from "@/types";
import CdsGroupCard from "./components/cdsGroupCard";

export default function CDSPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, isLoading, error } = useSWR("/dashboard/add", getCdsGroups, {
    refreshInterval: 10000,
  });

  const handleModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="w-full h-full flex flex-row lg:px-2">
      <div className="flex-auto bg-gray-800 rounded-t-lg mt-2 light:bg-gray-50">
        <AddCdsGroupForm modalStatus={isModalOpen} handleModal={handleModal} />

        <div className="h-full w-full">
          <div className="bg-white dark:bg-gray-800 h-full relative shadow-md sm:rounded-lg overflow-hidden overflow-y-scroll text-start">
            <div className="flex justify-between align-center py-5 px-3">
              <h1 className="justify-self-start align-top font-bold text-2xl">
                CDS Groups
              </h1>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex flex-row text-white bg-blue-700 hover:bg-blue-80 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <LuPlus className="w-5 h-5 mr-2" />
                Add CDS Group
              </button>
            </div>
            <div className="py-8 px-4 lg:py-16 lg:px-6">
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {Array.isArray(data) &&
                  data.map(
                    (cdsGroup: cdsGroupInterface, groupIndex: number) => (
                      <CdsGroupCard key={groupIndex} cdsGroup={cdsGroup} />
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
