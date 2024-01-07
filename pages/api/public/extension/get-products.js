import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const products = await prisma.product.findMany({
        take: 5,
        include: {
          account: {
            select: {
              fullDomain: true,
            },
          },
        },
      });
      console.log("products", products)

      res.status(200).send({ products });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }
}
