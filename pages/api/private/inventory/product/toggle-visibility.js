import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updateProductVisibility } from "@/helper/server/prisma/inventory/product-schema";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  if (method === "POST") {
    const { id, visibility } = body;
    const idInt = parseInt(id);

    const { success, value, error } = await updateProductVisibility(
      idInt,
      visibility
    );

    if (success) {
      res.status(200).json({ product: value });
    } else {
      res.status(405).json({ message: "Internal server error", error });
    }
  }
}
