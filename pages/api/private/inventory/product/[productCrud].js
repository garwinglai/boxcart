import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import {
  createProductServer,
  deleteProductServer,
  getProductsServer,
  updateProductServer,
} from "@/helper/server/prisma/inventory/product-schema";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, query, body } = req;
  if (method === "POST") {
    const { productCrud } = query;

    if (productCrud === "create") {
      const { product } = JSON.parse(body);
      const resProductCreate = await createProductServer(product);
      const { success, value } = resProductCreate;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }

    if (productCrud === "update") {
      const product = JSON.parse(body);
      console.log("update product"), product;
      const resProductUpdate = await updateProductServer(product);
      const { success, value } = resProductUpdate;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }

    if (productCrud === "delete") {
      const { productId } = JSON.parse(body);
      const resProductDelete = await deleteProductServer(productId);
      const { success, value, error } = resProductDelete;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(error);
      }
    }
  }

  if (method === "GET") {
    const { productCrud, accountId } = query;
    const accountIdInt = parseInt(accountId);

    if (productCrud === "get") {
      const resProductGet = await getProductsServer(accountIdInt);
      const { success, value } = resProductGet;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }
  }
}
