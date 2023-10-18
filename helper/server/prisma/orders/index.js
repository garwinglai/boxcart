import prisma from "@/lib/prisma";

export async function createOrder(orderData) {
  try {
    const order = await prisma.customerOrder.create({
      data: orderData,
    });

    return { success: true, value: order };
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
