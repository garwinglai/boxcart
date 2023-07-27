import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updateHasScheduleAccountServer } from "@/helper/server/prisma/availability/availability-toggle.crud";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body, query } = req;

  if (method === "POST") {
    const enabledSchedule = JSON.parse(body);
    const { accountId } = query;

    const resUpdateAccount = await updateHasScheduleAccountServer(
      enabledSchedule,
      accountId
    );

    const { success, value } = resUpdateAccount;

    if (success) {
      res.status(200).json(value);
    } else {
      res.status(500).json(value);
    }
  }
}
