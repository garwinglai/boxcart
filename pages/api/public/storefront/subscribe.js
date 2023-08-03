import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const { customerEmail, accountId } = body;

    try {
      await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          subscriberCount: {
            increment: 1,
          },
          subscribers: {
            create: {
              email: customerEmail,
            },
          },
        },
      });

      res.status(200).json({ message: "success" });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = {
          code: error.code,
          message: error.message,
          target: error.meta,
        };

        console.log("prismaError", prismaError.code);

        res.status(500).json({ errorCode: prismaError.code });
        return;
      }

      res.status(500).json({ message: "error" });
    }
  }
}
