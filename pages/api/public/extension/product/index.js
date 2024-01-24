import {
  createProductServer,
  deleteProductServer,
  getProductsServer,
  updateProductServer,
} from "@/helper/server/prisma/inventory/product-schema";

export default async function handler(req, res) {
  const { method, query, body } = req;

  if (method === "GET") {
    const { productCrud, accountId } = query;
    const accountIdInt = parseInt(accountId);

    const resProductGet = await getProductsServer(accountIdInt);
    const { success, value } = resProductGet;

    if (success) {
      res.status(200).json(value);
    } else {
      res.status(500).json(value);
    }
  }
}
