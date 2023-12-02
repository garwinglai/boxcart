import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === "GET") {
    const { email, accountId } = query;
    const id = parseInt(accountId);

    try {
      const customer = await prisma.customer.findUnique({
        where: {
          email,
          accountId: id,
        },
      });

      res.status(200).json({ success: true, customer });
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
