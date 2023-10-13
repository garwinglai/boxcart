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
            // if (!fulfillment) return;
            const { method } = fulfillment;

            return {
              where: {
                fulfillment_identifier: {
                  accountId,
                  method: method,
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
        checklist: {
          update: {
            requireAvailability: data.some((item) => item.method === "pickup"),
          },
        },
      },
      include: {
        fulfillmentMethods: true,
        availability: {
          include: {
            datesAvailability: true,
            datesRangedAvailability: true,
            daysOfWeekAvailability: true,
          },
        },
      },
    });

    return { success: true, value: updatedFulfillment };
  } catch (error) {
    console.log("upsertFulfillmentServer error", error);
    return { success: false, value: null, error };
  }
}
