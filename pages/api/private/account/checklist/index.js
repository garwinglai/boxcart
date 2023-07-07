import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { checkIsChecklistCompleteServer } from "@/helper/server/prisma/account/account-schema";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, query, searchParams } = req;
  const { email } = query;

  if (method === "GET") {
    const resAccount = await checkIsChecklistCompleteServer(email);
    const { success, value } = resAccount;

    if (success) {
      res.status(200).json(value);
    } else {
      res.status(500).json(value);
    }
  }
}
