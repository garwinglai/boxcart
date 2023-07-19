import prisma from "@/lib/prisma";

export async function upsertFulfillmentServer(fulfillmentData) {
  const { removedFulfillmentIds, data, accountId, fulfillmentMethodInt } =
    fulfillmentData;

  try {
    const updatedFulfillment = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        fulfillmentMethodInt,
        fulfillmentMethods: {
          upsert: data.map((fulfillment) => {
            console.log("fulfillment", fulfillment);
            if (!fulfillment) return;

            return {
              where: {
                fulfillment_identifier: {
                  accountId,
                  method: fulfillment.method,
                },
              },
              update: fulfillment,
              create: fulfillment,
            };
          }),
          deleteMany: removedFulfillmentIds.map((item) => {
            const { id, method } = item;
            return {
              id,
            };
          }),
        },
      },
      include: {
        fulfillmentMethods: true,
      },
    });

    console.log("success", updatedFulfillment);

    return { success: true, value: updatedFulfillment };
  } catch (error) {
    console.log("upsertFulfillmentServer error", error);
    return { success: false, value: null, error };
  }
}
