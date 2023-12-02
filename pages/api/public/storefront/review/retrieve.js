import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === "GET") {
    const { accountId, productId } = query;
    const accId = parseInt(accountId);
    const prodId = parseInt(productId);

    try {
      const reviews = await prisma.review.findMany({
        where: {
          product: {
            id: prodId,
            accountId: accId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.status(200).json({ success: true, reviews });
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
