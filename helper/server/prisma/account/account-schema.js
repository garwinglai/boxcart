import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function updateAccountFirstLoginServer(body) {
  const id = JSON.parse(body);

  try {
    const updateUser = await prisma.account.update({
      where: {
        id,
      },
      data: {
        isFirstLogin: false,
      },
    });

    return { success: true, value: updateUser };
  } catch (error) {
    console.log("error creating user", error);
    return { success: false, error };
  }
}

export async function checkIsChecklistCompleteServer(email) {
  try {
    const account = await prisma.account.findUnique({
      where: {
        email,
      },
      include: {
        checklist: true,
      },
    });

    return { success: true, value: account };
  } catch (error) {
    console.log("error creating user", error);
    return { success: false, error };
  }
}
