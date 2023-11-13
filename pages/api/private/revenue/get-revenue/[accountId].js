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
    const { accountId } = query;
    const id = parseInt(accountId);

    try {
      const revenue = await prisma.revenue.findUnique({
        where: {
          accountId: id,
        },
      });

      res.status(200).json({ success: true, revenue });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
}
