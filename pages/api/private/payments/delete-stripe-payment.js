import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  if (method === "POST") {
    const { stripeAccountId } = JSON.parse(body);

    try {
      const deleted = await prisma.acceptedPayment.delete({
        where: {
          stripeAccountId,
        },
      });
      res.status(200).json({ success: true, deleted });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ success: false, error });
    }
  }
}
