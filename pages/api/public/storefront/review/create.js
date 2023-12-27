import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const {
      reviewData,
      accountId,
      productId,
      isProductDigital,
      customerId,
      productData,
      accountData,
      shopperId,
    } = body;
    const accId = parseInt(accountId);
    const prodId = parseInt(productId);
    const custId = parseInt(customerId);
    const shopId = shopperId ? parseInt(shopperId) : null;

    console.log("isProductDigital", isProductDigital);

    const promises = [];

    const review = prisma.review.create({
      data: {
        ...reviewData,
        account: {
          connect: {
            id: accId,
          },
        },
        product: !isProductDigital
          ? {
              connect: {
                id: prodId,
              },
            }
          : undefined,
        digitalProduct: isProductDigital
          ? {
              connect: {
                id: prodId,
              },
            }
          : undefined,
        customer: {
          connect: {
            id: custId,
          },
        },
        shopperAccount: shopId
          ? {
              connect: {
                id: shopId,
              },
            }
          : undefined,
      },
    });
    promises.push(review);

    if (isProductDigital) {
      const product = prisma.digitalProduct.update({
        where: {
          id: prodId,
        },
        data: productData,
      });
      promises.push(product);
    } else {
      const product = prisma.product.update({
        where: {
          id: prodId,
        },
        data: productData,
      });
      promises.push(product);
    }

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
      console.log("error", error);
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

      res.status(500).json({ success: false, error: "error" });
    }
  }
}
