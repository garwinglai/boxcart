import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updateAccountSettingsServer } from "@/helper/server/prisma/account/account-schema";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body, query } = req;
  const { crud } = query;

  if (method === "POST") {
    if (crud === "update") {
      const updatedAccount = await updateAccountSettingsServer(body);
      const { success } = updatedAccount;

      if (success) {
        res.status(200).json(updatedAccount);
      } else {
        res.status(500).json(updatedAccount);
      }
    }
  }
}
