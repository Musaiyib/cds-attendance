"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/prisma"
import { CorpInterface, cdsGroupInterface } from "@/types";

export const addCorp = async (prevState: any, formData: FormData) => {
    const fieldsToMap = ['fullName', 'stateCode', 'cdsGroup', 'ppa', 'phone', 'state', 'course', 'university'];
    const data: { [key: string]: string } = {};
    fieldsToMap.forEach((fieldName) => {
        const value = formData.get(fieldName);
        if (value !== null) {
            data[fieldName] = value as string;
        }
    });
    const { fullName, stateCode, cdsGroup, ppa, phone, state, course, university } = data

    try {
        await prisma.corp.create({
            data: {
                fullName,
                stateCode,
                cdsGroupId: cdsGroup,
                ppa,
                phone,
                state,
                course,
                university,
                attendance: { week1: false, week2: false, week3: false, week4: false }
            },
        });

        revalidatePath("/dashboard/add")
        return { message: "Corp added successfully", success: true }
    } catch (error) {
        return { message: "Failed to add corp", success: false }
    }
};

export const fetchCorps = async (): Promise<CorpInterface[]> => {
    try {
        const corps = await prisma.corp.findMany();
        return corps;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};


export const addCDS = async (
    prevState: any,
    formData: FormData | undefined
) => {
    try {
        if (!formData) {
            return
        }
        const name = formData.get("name") as string;
        await prisma.cdsGroup.create({
            data: {
                name,
                amountPaid: 0,
            }
        })
        return {
            message: "CDS group added successfully", success: true
        }
    } catch (error) {
        console.error("Error adding CDS:", error);
        return { message: "Error adding CDS", success: true }
    }
}

export const getSingleCdsGroup = async (
    id: string
): Promise<cdsGroupInterface | { message: string; code: number }> => {
    try {
        const cdsGroup = await prisma.cdsGroup.findUnique({
            where: {
                id
            },
            include: {
                corps: true
            }
        })
        if (!cdsGroup) {
            return { message: `Can't find cds group with this id "${id}"`, code: 400 }
        } else {
            return cdsGroup
        }
    } catch (error) {
        console.log(error)
        return { message: "Error while fetching cds groups", code: 400 }
    }
}

export const getCdsGroups = async (): Promise<cdsGroupInterface[] | string> => {
    try {
        const cdsGroups = await prisma.cdsGroup.findMany({
            include: {
                corps: {
                    select: {
                        id: true
                    }
                }
            }
        })
        return cdsGroups
    } catch (error) {
        console.log(error)
        return "Error while fetching cds groups"
    }
}

export const updateAttendance = async (
    corpId: string,
    attendance: { week1: boolean; week2: boolean; week3: boolean; week4: boolean }
) => {
    try {
        await prisma.corp.update({
            where: {
                id: corpId
            },
            data: {
                attendance: attendance
            }
        })
        return { message: "Attendance updated successfully", code: 200 }
    } catch (error) {
        console.error("Error updating attendance:", error);
        return { message: "Error updating attendance", code: 400 }
    }
}

export const updateLegacyFee = async (user: string): Promise<{ message: string, code: number }> => {
    try {
        await prisma.corp.update({
            where: {
                id: user
            },
            data: {
                legacyFee: true
            }
        })
        return { message: "Legacy fee updated", code: 200 }
    } catch (error) {
        console.error(error)
        return { message: "Failed to update legacy fee", code: 400 }
    }
}