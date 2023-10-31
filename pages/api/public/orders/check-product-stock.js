import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method, query } = req;
  const { productId } = query;

  if (method === "GET") {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: parseInt(productId),
        },
      });

      res.status(200).json({ product });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error });
    }
  }
}
