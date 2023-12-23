"use server"

import { signIn, signOut } from "@/auth";
import { prisma } from "@/prisma"
import { CorpInterface, cdsGroupInterface, userInterface } from "@/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt"

export const addCorp = async (corpData: CorpInterface, id?: string): Promise<{ message: string, code: number }> => {

    const { fullName, stateCode, cdsGroupId, ppa, phone, state, course, university } = corpData

    try {
        if (!id) {
            const checkMembers = await prisma.cdsGroup.findUnique({
                where: {
                    id: cdsGroupId
                },
                include: {
                    corps: {
                        orderBy: {
                            stateCode: 'asc'
                        }
                    }
                }
            })
            if (checkMembers && checkMembers?.corps.length < 1) {
                await prisma.corp.create({
                    data: {
                        fullName,
                        stateCode,
                        cdsGroupId,
                        ppa,
                        phone,
                        state,
                        role: "president",
                        course,
                        university,
                        attendance: { week1: false, week2: false, week3: false, week4: false }
                    },
                });
            } else {
                await prisma.corp.create({
                    data: {
                        fullName,
                        stateCode,
                        cdsGroupId,
                        ppa,
                        phone,
                        state,
                        course,
                        university,
                        attendance: { week1: false, week2: false, week3: false, week4: false }
                    },
                });
            }
            return { message: "Corp added successfully", code: 200 }
        } else {
            await prisma.corp.update({
                where: {
                    id
                },
                data: {
                    fullName,
                    stateCode,
                    cdsGroupId,
                    ppa,
                    phone,
                    state,
                    course,
                    university
                },
            })
            return { message: "Corp updated successfully", code: 200 }
        }
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { message: "State code already exists. Please provide a unique state code.", code: 400 };
            } else {
                // Handle other known Prisma errors
                console.error('Prisma error:', error);
                return { message: "Failed to add corp due to a Prisma error.", code: 400 };
            }
        } else {
            // Handle unknown or other types of errors
            console.error('Unknown error:', error);
            return { message: "Failed to add corp due to an unknown error.", code: 400 };
        }
    }
};

export const fetchCorps = async (): Promise<CorpInterface[]> => {
    try {
        const corps = await prisma.corp.findMany({
            orderBy: {
                stateCode: 'asc'
            }
        });
        return corps;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};


export const addCDS = async (
    cdsGroupName: string, id?: string
): Promise<{ message: string, code: number }> => {

    try {
        if (!cdsGroupName) {
            return {
                message: "Cds name is required", code: 400
            }
        }
        if (!id) {
            await prisma.cdsGroup.create({
                data: {
                    name: cdsGroupName,
                }
            })
            return {
                message: "CDS group added successfully", code: 200
            }
        } else {
            await prisma.cdsGroup.update({
                where: {
                    id
                },
                data: {
                    name: cdsGroupName
                }
            })
            return {
                message: "CDS group updated successfully", code: 200
            }
        }
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { message: "CDS group name already exists. Please provide a unique name.", code: 400 };
            } else {
                console.error('Prisma error:', error);
                return { message: "Failed to add or update CDS due to a Prisma error.", code: 400 };
            }
        } else {
            // Handle unknown or other types of errors
            console.error('Unknown error:', error);
            return { message: "Failed to add or update cds group due to an unknown error.", code: 400 };
        }
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
                corps: {
                    orderBy: {
                        stateCode: 'asc'
                    }
                },
            }
        })
        if (!cdsGroup) {
            return { message: `Can't find cds group with this id "${id}"`, code: 400 }
        } else {
            return cdsGroup
        }
    } catch (error) {
        console.log(error)
        return { message: "Error while fetching cds group", code: 400 }
    }
}

export const getCdsGroups = async (): Promise<cdsGroupInterface[] | string> => {
    try {
        const cdsGroups = await prisma.cdsGroup.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                corps: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                        phone: true,
                        stateCode: true
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

export const updateLegacyFee = async (corpId: string, cdsId: string): Promise<{ message: string, code: number }> => {
    try {
        await prisma.$transaction([
            prisma.corp.update({
                where: {
                    id: corpId
                },
                data: {
                    legacyFee: true
                }
            }),
            prisma.cdsGroup.update({
                where: {
                    id: cdsId
                },
                data: {
                    legacyFee: {
                        increment: 1
                    }
                }
            })])
        return { message: "Legacy fee updated", code: 200 }
    } catch (error) {
        console.error(error)
        return { message: "Failed to update legacy fee", code: 400 }
    }
}

export const updateWeeklyDues = async (corpId: string, cdsId: string, action: number): Promise<{ message: string, code: number }> => {

    try {
        if (action === 1) {
            // update corp member amount
            await prisma.corp.update({
                where: {
                    id: corpId
                },
                data: {
                    weeklyDues: {
                        increment: 50
                    }
                }
            })
            //update cds amount
            await prisma.cdsGroup.update({
                where: {
                    id: cdsId
                },
                data: {
                    amountPaid: {
                        increment: 50
                    }
                }
            })
        } else if (action === 0) {
            // update corp member amount
            await prisma.corp.update({
                where: {
                    id: corpId
                },
                data: {
                    weeklyDues: {
                        decrement: 50
                    }
                }
            })
            //update cds amount
            await prisma.cdsGroup.update({
                where: {
                    id: cdsId
                },
                data: {
                    amountPaid: {
                        decrement: 50
                    }
                }
            })
        }
        return { message: "Legacy fee updated successfully", code: 200 }
    } catch (error) {
        console.error(error)
        return { message: "Failed to update legacy fee", code: 400 }
    }
}

export const deleteCdsGroup = async (cdsGroupId: string): Promise<{ message: string, code: number }> => {
    try {
        await prisma.cdsGroup.delete({
            where: {
                id: cdsGroupId
            }
        })
        revalidatePath('/dashboard/cds')
        return { message: "Cds group has been  successfully", code: 200 }
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2014') {
            // Handle the required relation violation error
            return { message: "Cannot delete the CDS group due to existing corps in the group. Please remove all the corp members first.", code: 400 };

        } else if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025' && error.meta?.cause === 'Record to delete does not exist.') {
            return { message: 'Cds group record does not exist', code: 400 }
        } else {
            // Handle other known Prisma errors or log the error for investigation
            console.error('Prisma error:', error);
            return { message: "Failed to delete CDS group due to a Prisma error.", code: 400 };
        }
    }
}

export const deleteCorpMember = async (corpId: string): Promise<{ message: string, code: number }> => {
    try {
        await prisma.corp.delete({
            where: {
                id: corpId
            }
        })
        revalidatePath('/dashboard/add')
        return { message: "Corp has been deleted successfully", code: 200 }
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2014') {
            // Handle the required relation violation error
            return { message: "Cannot delete the CDS group due to existing corps in the group. Please remove all the corp members first.", code: 400 };
        } else if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025' && error.meta?.cause === 'Record to delete does not exist.') {
            return { message: 'Corp record does not exist', code: 400 }
        }
        else {
            // Handle other known Prisma errors or log the error for investigation
            console.error('Prisma error:', error);
            return { message: "Failed to delete CDS group due to a Prisma error.", code: 400 };
        }
    }
}

export const updateCDSPresident = async (oldPresidentId: string, newPresidentId: string, email: string, password: string): Promise<{ message: string, code: number }> => {
    try {
        await prisma.$transaction([
            prisma.corp.update(
                {
                    where: {
                        id: oldPresidentId
                    },
                    data: {
                        role: "member",
                        email: "",
                        password: ""
                    }
                }
            ),
            prisma.corp.update(
                {
                    where: {
                        id: newPresidentId
                    },
                    data: {
                        role: "president",
                        email,
                        password,
                    }
                }
            )])
        return { message: "CDS group president has been updated successfully", code: 200 }
    } catch (error: unknown) {

        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025' && error.meta?.cause === 'Record to delete does not exist.') {
            return { message: 'Corp record does not exist', code: 400 }
        }
        else {
            // Handle other known Prisma errors or log the error for investigation
            console.error('Prisma error:', error);
            return { message: "Failed to update CDS group president due to a Prisma error.", code: 400 };
        }
    }
}

// Login user

export const getUser = async (email: string): Promise<userInterface | null> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return user || null; // Return null if user is not found
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export const handleLogOut = async () => {
    await signOut();

}

// seed users
// (async () => {
//     try {
//         const usersCount = await prisma.user.count();
//         const hashedPassword = await hash("12345678", 10)
//         if (usersCount === 0) {
//             const defaultUser = {
//                 email: "admin@bolari.com",
//                 name: "Admin User",
//                 phone: "1234567890",
//                 password: hashedPassword,
//                 role: "admin",
//             };
//             const defaultUser2 = {
//                 email: "staff@bolari.com",
//                 name: "staff User",
//                 phone: "1234567890",
//                 password: hashedPassword,
//             };

//             await prisma.user.create({ data: defaultUser });
//             await prisma.user.create({ data: defaultUser2 });

//             console.log("User collection was empty. Seeded default user.");
//         } else {
//             console.log("User collection already has data. Skipping seeding.");
//         }
//     } catch (error) {
//         console.error("Failed to seed users:", error);
//         throw new Error("Failed to seed users.");
//     }
// })();