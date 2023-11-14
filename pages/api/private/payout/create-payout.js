import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import {
  getOrders,
  getPendingOrders,
  updateOrderStatusServer,
} from "@/helper/server/prisma/orders";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  if (method === "GET") {
    const { accountId, payoutData } = body;
    const id = parseInt(accountId);

    const payout = await prisma.payout.create({
      data: {
        ...payoutData,
        account: {
          connect: {
            id,
          },
        },
      },
    });

    try {
      res.status(200).json({ success: true, payout });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
}
