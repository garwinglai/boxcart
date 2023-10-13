import { updateOrderPaymentStatusAndStripeIdServer } from "@/helper/server/prisma/orders";

export default async function handler(req, res) {
  const { orderId, paymentStatus } = req.body;
  // update payment status
  const { method, body } = req;

  if (method === "POST") {
    const orderData = body;

    const resOrderStatusUpdate =
      await updateOrderPaymentStatusAndStripeIdServer(orderData);
    const { success, value, error } = resOrderStatusUpdate;

    if (success) {
      res.status(200).json({ value });
    } else {
      res.status(500).json({ error });
    }
  }
}
