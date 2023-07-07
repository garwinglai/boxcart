import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updateAccountFirstLoginServer } from "@/helper/server/prisma/account/account-schema";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  if (method === "POST") {
    const createUserResponse = await updateAccountFirstLoginServer(body);
    const { success } = createUserResponse;

    if (success) {
      res.status(200).json(createUserResponse);
    } else {
      res.status(500).json(createUserResponse);
    }
  }
}
