import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function updateEmailIsVerifiedUser(id) {
  const idInt = parseInt(id);

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: idInt,
      },
      data: {
        isEmailVerified: true,
      },
    });

    return { success: true, value: updatedUser };
  } catch (error) {
    console.log(
      "helper/client/api/account updateEmailIsVerified error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateEmailIsVerifiedAccount(id) {
  const idInt = parseInt(id);

  try {
    const updatedUser = await prisma.account.update({
      where: {
        id: idInt,
      },
      data: {
        isEmailVerified: true,
      },
    });

    return { success: true, value: updatedUser };
  } catch (error) {
    console.log(
      "helper/client/api/account updateEmailIsVerified error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateEmailIsVerifiedChecklist(id) {
  const idInt = parseInt(id);

  try {
    const updatedUser = await prisma.checklist.update({
      where: {
        accountId: idInt,
      },
      data: {
        isEmailVerified: true,
      },
    });

    return { success: true, value: updatedUser };
  } catch (error) {
    console.log(
      "helper/client/api/account updateEmailIsVerified error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateUserIsActive(id) {
  const idInt = parseInt(id);
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: idInt,
      },
      data: {
        isActive: true,
      },
    });

    return { success: true, value: updatedUser };
  } catch (error) {
    console.log("helper/client/api/account/updateUserIsActive error:", error);

    return { success: false, error };
  }
}
