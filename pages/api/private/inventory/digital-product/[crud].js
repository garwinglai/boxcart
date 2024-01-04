import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import {
  createDigitalProductsServer, deleteDigitalProductServer, getDigitalProductsServer, updateDigitalProductServer
} from "@/helper/server/prisma/inventory/product-schema";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, query, body } = req;
  if (method === "POST") {
    const { crud } = query;

    if (crud === "create") {
      const { product } = JSON.parse(body);

      const resProductCreate = await createDigitalProductsServer(product);
      const { success, value } = resProductCreate;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }

    if (crud === "update") {
      const product = JSON.parse(body);

      const resProductUpdate = await updateDigitalProductServer(product);
      const { success, value } = resProductUpdate;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }

    if (crud === "delete") {
      const { productId } = JSON.parse(body);
      const resProductDelete = await deleteDigitalProductServer(productId);
      const { success, value, error } = resProductDelete;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(error);
      }
    }
  }

  if (method === "GET") {
    const { crud, accountId } = query;
    const accountIdInt = parseInt(accountId);

    if (crud === "get") {
      const resProductGet = await getDigitalProductsServer(accountIdInt);
      const { success, value } = resProductGet;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }
  }
}
