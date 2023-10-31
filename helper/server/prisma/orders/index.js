import prisma from "@/lib/prisma";

export async function createOrder(
  orderData,
  productQuantitiesToUpdate,
  optionQuantitiesToUpdate
) {
  const productQuantityUpdateLength = productQuantitiesToUpdate.length;
  const optionQuantityUpdateLength = optionQuantitiesToUpdate.length;

  try {
    const resTransaction = await prisma.$transaction(async (tx) => {
      // 1. create customer order
      const customerOrder = await tx.customerOrder.create({
        data: orderData,
      });

      if (productQuantityUpdateLength > 0) {
        for (let i = 0; i < productQuantitiesToUpdate.length; i++) {
          const curr = productQuantitiesToUpdate[i];
          const { productId, quantity } = curr;

          await prisma.product.update({
            where: {
              id: productId,
            },
            data: {
              quantity: {
                decrement: quantity,
              },
            },
          });
        }
      }

      if (optionQuantityUpdateLength > 0) {
        for (let j = 0; j < optionQuantitiesToUpdate.length; j++) {
          const curr = optionQuantitiesToUpdate[j];
          const { optionId, quantity } = curr;

          await prisma.option.update({
            where: {
              id: optionId,
            },
            data: {
              quantity: {
                decrement: quantity,
              },
            },
          });
        }
      }

      return customerOrder;
    });

    console.log("resTransaction", resTransaction);
    return { success: true, value: resTransaction };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
}

export async function updateOrderStatusServer(orderData) {
  const { id, orderStatus } = orderData;

  try {
    const order = await prisma.customerOrder.update({
      where: {
        id,
      },
      data: {
        orderStatus,
      },
    });

    return { success: true, value: order };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
}

export async function updatePaymentErrorServer(orderData) {
  const { id, type, message, paymentStatus } = orderData;

  try {
    const order = await prisma.customerOrder.update({
      where: {
        id,
      },
      data: {
        stripeErrorType: type,
        stripeErrorMessage: message,
        paymentStatus,
      },
    });

    return { success: true, value: order };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
}

export async function updatePaymentStatusServer(orderData) {
  const { id, paymentStatus } = orderData;

  try {
    const order = await prisma.customerOrder.update({
      where: {
        id,
      },
      data: {
        paymentStatus,
      },
    });

    return { success: true, value: order };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
}

export async function updateOrderPaymentStatusAndStripeIdServer(orderData) {
  const { id, paymentStatus, stripeOrderId } = orderData;

  try {
    const order = await prisma.customerOrder.update({
      where: {
        id,
      },
      data: {
        paymentStatus,
        stripeOrderId,
      },
    });

    return { success: true, value: order };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
}

export async function getPendingOrders() {
  try {
    const orders = await prisma.customerOrder.findMany({
      where: {
        orderStatus: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: {
          include: {
            orderOptionGroups: true,
            orderExampleImages: true,
            orderQuestionsAnswers: true,
          },
        },
        customer: true,
      },
    });

    return { success: true, value: orders };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
}

export async function getHistoryOrders() {
  try {
    const orders = await prisma.customerOrder.findMany({
      where: {
        orderStatus: { not: "pending" },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: {
          include: {
            orderOptionGroups: true,
            orderExampleImages: true,
            orderQuestionsAnswers: true,
          },
        },
        customer: true,
      },
    });

    return { success: true, value: orders };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
}
