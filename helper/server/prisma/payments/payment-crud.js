import prisma from "@/lib/prisma";

export async function updateStripeSetupComplete(data) {
  const { paymentId, stripe_details, stripe_charges } = data;

  try {
    const stripePayment = await prisma.acceptedPayment.update({
      where: {
        id: paymentId,
      },
      data: {
        details_submitted: stripe_details,
        charged_enabled: stripe_charges,
      },
    });

    return { success: true, value: stripePayment };
  } catch (error) {
    console.log("update stripe setup error", error);
    return { success: false, value: null, error };
  }
}
export async function saveStripeIdServer(data) {
  const { accountId, stripeId } = data;

  try {
    const stripePayment = await prisma.acceptedPayment.create({
      data: {
        isEnabled: false,
        paymentMethod: "stripe",
        stripeAccountId: stripeId,
        details_submitted: false,
        charged_enabled: false,
        account: {
          connect: {
            id: accountId,
          },
        },
      },
    });

    return { success: true, value: stripePayment };
  } catch (error) {
    console.log("saveStripeIdServer error", error);
    return { success: false, value: null, error };
  }
}

export async function updatePaymentServer(data) {
  const {
    accountData,
    // depositData,
    paymentData,
    accountId,
    removedPayments,
  } = data;

  // const { requireDeposit } = accountData;

  try {
    const updatedPayment = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        ...accountData,
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
        acceptedPayments: true,
      },
    });

    return { success: true, value: updatedPayment };
  } catch (error) {
    console.log("updatePaymentServer error", error);
    return { success: false, value: null, error };
  }
}
