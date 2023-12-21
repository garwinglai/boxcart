import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === "GET") {
    const { email } = query;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          shopperAccount: true,
          accounts: true,
        },
      });

      res.status(200).json({ success: true, user });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = {
          code: error.code,
          message: error.message,
          target: error.meta,
        };

        console.log("prismaError", prismaError.code);

        res.status(500).json({ success: false, error: prismaError.code });
        return;
      }
      console.log("error", error);

      res.status(500).json({ success: false, error: "error" });
    }
  }
}
