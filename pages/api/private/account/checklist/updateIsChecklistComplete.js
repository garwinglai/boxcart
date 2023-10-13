import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updateIsChecklistCompleteInAccount } from "@/helper/server/prisma/checklist";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  if (method === "POST") {
    const resUpdateAccount = await updateIsChecklistCompleteInAccount(body);

    const { success, value } = resUpdateAccount;

    if (success) {
      res.status(200).json(value);
    } else {
      res.status(500).json(value);
    }
  }
}
