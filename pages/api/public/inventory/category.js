import {
  getCategoryServer,
  getProductsByCategoryIdServer,
} from "@/helper/server/prisma/inventory/category-schema";

export default async function handler(req, res) {
  const { method, query, body } = req;

  if (method === "GET") {
    const { categoryCrud, accountId, categoryId } = query;
    const accountIdInt = parseInt(accountId);

    if (accountId) {
      const resProductGet = await getCategoryServer(accountIdInt);
      const { success, value } = resProductGet;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }

    if (categoryId) {
      const categoryIdInt = parseInt(categoryId);
      const resProductGet = await getProductsByCategoryIdServer(categoryIdInt);

      const { success, value } = resProductGet;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }
  }
}
