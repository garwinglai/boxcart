import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === "GET") {
    const { accountId, search } = query;
    const id = parseInt(accountId);

    try {
      const products = await prisma.product.findMany({
        where: {
          accountId: id,
          productName: {
            search,
          },
          description: {
            search,
          },
          tags: {
            search,
          },
        },
        include: {
          images: true,
          optionGroups: {
            include: {
              options: true,
            },
          },
          questions: true,
          relatedCategories: true,
        },
      });
      res.status(200).json({ products });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error });
    }
  }
}
