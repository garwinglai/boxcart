import { createOrder } from "@/helper/server/prisma/orders";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const { order, productQuantitiesToUpdate, optionQuantitiesToUpdate } = body;

    const createdOrder = await createOrder(
      order,
      productQuantitiesToUpdate,
      optionQuantitiesToUpdate
    );
    const { success, value, error } = createdOrder;

    if (success) {
      res.status(200).json({ value });
    } else {
      res.status(500).json({ error });
    }
  }
}
