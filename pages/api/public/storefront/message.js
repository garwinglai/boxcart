import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const { contact, accountId } = body;

    try {
      await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          contacts: {
            create: contact,
          },
        },
      });
      console.log("success");
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
      console.log("error", error);

      res.status(500).json({ message: "error" });
    }
  }
}
