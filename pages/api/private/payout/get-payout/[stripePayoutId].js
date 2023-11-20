import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, query } = req;

  if (method === "GET") {
    const { stripePayoutId } = query;

    const payout = await prisma.payout.findUnique({
      where: {
        stripePayoutId,
      },
    });

    try {
      res.status(200).json({ success: true, payout });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
}
