import prisma from "@/lib/prisma";

export async function updatePaymentServer(data) {
  const {
    accountData,
    tipsData,
    depositData,
    paymentData,
    accountId,
    removedPayments,
  } = data;

  const { enableTips, requireDeposit } = accountData;

  try {
    const updatedPayment = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        enableTips,
        requireDeposit,
        tips: {
          upsert: {
            where: {
              accountId,
            },
            update: tipsData,
            create: tipsData,
          },
          delete: !enableTips && tipsData,
        },
        deposit: {
          upsert: {
            where: {
              accountId,
            },
            update: depositData,
            create: depositData,
          },
          delete: !requireDeposit && depositData,
        },
        acceptedPayments: {
          upsert: paymentData.map((payment) => {
            if (!payment) return;

            const { paymentMethod } = payment;

            return {
              where: {
                payment_identifier: {
                  paymentMethod: paymentMethod,
                  accountId,
                },
              },
              update: payment,
              create: payment,
            };
          }),
          deleteMany: removedPayments.map((item) => {
            const { paymentMethod } = item;
            return {
              paymentMethod,
            };
          }),
        },
      },
      include: {
        tips: true,
        deposit: true,
        acceptedPayments: true,
      },
    });

    return { success: true, value: updatedPayment };
  } catch (error) {
    console.log("updatePaymentServer error", error);
    return { success: false, value: null, error };
  }
}
