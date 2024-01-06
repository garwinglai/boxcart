import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const products = await prisma.product.findMany({
        include: {
          account: {
            select: {
              fullDomain: true,
            },
          },
        },
      });

      res.status(200).json({ products });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
}
