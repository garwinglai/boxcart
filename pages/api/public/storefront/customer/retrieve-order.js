import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === "GET") {
    const { customerId, accountId, productId } = query;
    const accId = parseInt(accountId);
    const custId = parseInt(customerId);
    const prodId = parseInt(productId);

    try {
      const order = await prisma.product.findUnique({
        where: {
          id: prodId,
        },
        select: {
          customerOrder: {
            where: {
              customerId: custId,
              accountId: accId,
            },
          },
        },
      });

      res.status(200).json({ success: true, order });
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
