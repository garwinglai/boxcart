import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import {
  createCategoryServer,
  deleteCategoryServer,
  getCategoryServer,
  updateCategoryServer,
} from "@/helper/server/prisma/inventory/category-schema";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, query, body } = req;

  if (method === "POST") {
    const { categoryCrud } = query;

    if (categoryCrud === "create") {
      const product = body;
      const resProductCreate = await createCategoryServer(product);
      const { success, value, error } = resProductCreate;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(error);
      }
    }

    if (categoryCrud === "update") {
      const category = body;
      const resProductUpdate = await updateCategoryServer(category);
      const { success, value, error } = resProductUpdate;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(error);
      }
    }

    if (categoryCrud === "delete") {
      const categoryId = body;
      const resProductDelete = await deleteCategoryServer(categoryId);
      const { success, value } = resProductDelete;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }
  }

  if (method === "GET") {
    const { categoryCrud, accountId } = query;
    const accountIdInt = parseInt(accountId);

    if (categoryCrud === "get") {
      const resProductGet = await getCategoryServer(accountIdInt);
      const { success, value } = resProductGet;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }
  }
}
