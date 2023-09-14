import prisma from "@/lib/prisma";

export async function createOrder(orderData) {
  try {
    const order = await prisma.order.create({
      data: orderData,
    });

    return { success: true, value: order };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
}
