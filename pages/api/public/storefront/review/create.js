import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const {
      reviewData,
      accountId,
      productId,
      customerId,
      productData,
      accountData,
    } = body;
    const accId = parseInt(accountId);
    const prodId = parseInt(productId);
    const custId = parseInt(customerId);

    const promises = [];

    const review = prisma.review.create({
      data: {
        ...reviewData,
        account: {
          connect: {
            id: accId,
          },
        },
        product: {
          connect: {
            id: prodId,
          },
        },
        customer: {
          connect: {
            id: custId,
          },
        },
      },
    });
    promises.push(review);

    const product = prisma.product.update({
      where: {
        id: prodId,
      },
      data: productData,
    });
    promises.push(product);

    const account = prisma.account.update({
      where: {
        id: accId,
      },
      data: accountData,
    });
    promises.push(account);

    try {
      const [review, product, account] = await Promise.all(promises);

      const updatedReview = {
        review,
        product,
        account,
      };

      res.status(200).json({ success: true, updatedReview });
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
