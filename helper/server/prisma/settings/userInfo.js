import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function updateUserInfoServer(data) {
  const { accountId, userData } = data;
  const fullName = userData.firstName + " " + userData.lastName;

  try {
    const updateUser = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        ...userData,
        userName: fullName,
        user: {
          update: {
            ...userData,
            name: fullName,
          },
        },
      },
      include: {
        savedPaymentMethods: true,
      },
    });

    return { success: true, value: updateUser };
  } catch (error) {
    console.log("error creating user", error);
    return { success: false, error };
  }
}
