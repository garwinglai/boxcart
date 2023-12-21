import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const { shopperData } = body;
    const { id, shopperAccount } = shopperData;
    const userId = parseInt(id);
    const { email } = shopperAccount;

    try {
      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          shopperAccount: {
            connectOrCreate: {
              where: {
                email,
              },
              create: {
                ...shopperAccount,
              },
            },
          },
        },
        include: {
          shopperAccount: true,
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
