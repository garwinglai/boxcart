import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { getHistoryOrders } from "@/helper/server/prisma/orders";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body, query } = req;

  if (method === "GET") {
    const resOrderStatusUpdate = await getHistoryOrders();
    const { success, value, error } = resOrderStatusUpdate;

    if (success) {
      res.status(200).json(value);
    } else {
      res.status(500).json(error);
    }
  }
}
