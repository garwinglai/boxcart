import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, query, body } = req;

  if (method === "POST") {
    const { shopperCreditData, email } = body;
    try {
      const user = await prisma.shopperAccount.update({
        where: {
          email,
        },
        data: { ...shopperCreditData },
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
