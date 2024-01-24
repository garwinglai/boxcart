import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updateAccountSettingsServer } from "@/helper/server/prisma/account/account-schema";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body, query } = req;
  const { directory } = query;

  if (method === "PATCH") {
    if (directory === "settings") {
      const updatedAccount = await updateAccountSettingsServer(body);
      const { success } = updatedAccount;

      if (success) {
        res.status(200).json(updatedAccount);
      } else {
        res.status(500).json(updatedAccount);
      }
    }

    if (directory === "businessIdentity") {
      const { id, businessIdentities } = JSON.parse(body);
      const accountId = parseInt(id);

      try {
        const account = await prisma.account.update({
          where: {
            id: accountId,
          },
          data: {
            businessIdentities,
          },
        });

        res.status(200).json({ success: true, value: account });
      } catch (error) {
        res.status(500).json({ success: false, error });
        return;
      }
    }
  }
}
