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
