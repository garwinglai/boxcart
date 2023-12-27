import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const { customerEmail, shopperId } = body;

    try {
      await prisma.shopperAccount.update({
        where: {
          id: shopperId,
        },
        data: {
          subscribes: {
            connect: {
              email: customerEmail,
            },
          },
        },
      });

      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log("error", error);
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
