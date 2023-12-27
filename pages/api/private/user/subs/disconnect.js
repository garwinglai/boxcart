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
    const { id, email } = body;
    const accoundId = parseInt(id);

    try {
      const updateSubscriber = await prisma.subscriber.update({
        where: {
          email,
        },
        data: {
          accounts: {
            disconnect: {
              id: accoundId,
            },
          },
        },
        include: {
          accounts: {
            select: {
              id: true,
              businessName: true,
              fullDomain: true,
              logoImage: true,
              businessBio: true,
            },
          },
        },
      });

      res.status(200).json({ success: true, subs: updateSubscriber });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error });
      return;
    }
  }
}
