import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updateAccountSettingsServer } from "@/helper/server/prisma/account/account-schema";
import { updateUserInfoServer } from "@/helper/server/prisma/settings/userInfo";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  if (method === "POST") {
    const updatedAccount = await updateUserInfoServer(body);
    const { success, value } = updatedAccount;

    if (success) {
      res.status(200).json(updatedAccount);
    } else {
      res.status(500).json(updatedAccount);
    }
  }
}
