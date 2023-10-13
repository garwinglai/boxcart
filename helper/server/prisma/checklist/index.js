import prisma from "@/lib/prisma";

export async function updateProductVerifiedChecklistServer(accountId) {
  try {
    const udpatedChecklist = await prisma.checklist.update({
      where: { accountId },
      data: {
        isProductsUploaded: true,
      },
    });

    return { success: true, value: udpatedChecklist };
  } catch (error) {
    console.log(
      "helper/server/prisma/checklist updateProductVerifiedChecklistServer error:",
      error
    );
    return { success: false, error };
  }
}

export async function updateFulfillmentChecklistServer(accountId) {
  try {
    const udpatedChecklist = await prisma.checklist.update({
      where: { accountId },
      data: {
        isDeliverySet: true,
      },
    });

    return { success: true, value: udpatedChecklist };
  } catch (error) {
    console.log(
      "helper/server/prisma/checklist updateProductVerifiedChecklistServer error:",
      error
    );
    return { success: false, error };
  }
}

export async function updatePaymentChecklistServer(accountId) {
  try {
    const udpatedChecklist = await prisma.checklist.update({
      where: { accountId },
      data: {
        isPaymentsSet: true,
      },
    });

    return { success: true, value: udpatedChecklist };
  } catch (error) {
    console.log(
      "helper/server/prisma/checklist updateProductVerifiedChecklistServer error:",
      error
    );
    return { success: false, error };
  }
}

export async function updateAvailabilityChecklistServer(
  accountId,
  updateValue
) {
  const isAvailabilitySet = JSON.parse(updateValue);

  try {
    const udpatedChecklist = await prisma.checklist.update({
      where: { accountId },
      data: {
        isAvailabilitySet,
      },
    });

    return { success: true, value: udpatedChecklist };
  } catch (error) {
    console.log(
      "helper/server/prisma/checklist updateProductVerifiedChecklistServer error:",
      error
    );
    return { success: false, error };
  }
}

export async function updateViewStoreChecklistServer(accountId) {
  try {
    const udpatedChecklist = await prisma.checklist.update({
      where: { accountId },
      data: {
        hasViewedShareStore: true,
      },
    });

    return { success: true, value: udpatedChecklist };
  } catch (error) {
    console.log(
      "helper/server/prisma/checklist updateProductVerifiedChecklistServer error:",
      error
    );
    return { success: false, error };
  }
}

export async function updateIsChecklistCompleteInAccount(data) {
  const { accountId, isChecklistComplete } = data;

  try {
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        isChecklistComplete,
      },
    });

    return { success: true, value: updatedAccount };
  } catch (error) {
    console.log(
      "helper/server/prisma/checklist updateIsChecklistCompleteInAccount error:",
      error
    );
    return { success: false, error };
  }
}

export async function updateIsNonMandatoryChecklistComplete(data) {
  const { accountId, isChecklistComplete } = data;

  try {
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        isNonMandatoryChecklistComplete: isChecklistComplete,
      },
    });

    return { success: true, value: updatedAccount };
  } catch (error) {
    console.log(
      "helper/server/prisma/checklist updateIsChecklistCompleteInAccount error:",
      error
    );
    return { success: false, error };
  }
}
