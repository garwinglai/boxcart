import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updateOrderInAdvanceTimeServer } from "@/helper/server/prisma/availability/availability-crud";
import {
  updateHasScheduleAccountServer,
  updateOrderInAdvanceToggleAccountServer,
  updateTimeBlockToggleAccountServer,
} from "@/helper/server/prisma/availability/availability-toggle.crud";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body, query } = req;

  if (method === "POST") {
    const isToggleEnabled = JSON.parse(body);
    const { accountId, toggle } = query;

    if (toggle === "availability") {
      const resUpdateAccount = await updateHasScheduleAccountServer(
        isToggleEnabled,
        accountId
      );

      const { success, value } = resUpdateAccount;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }

    if (toggle === "timeBlock") {
      const resUpdateAccount = await updateTimeBlockToggleAccountServer(
        isToggleEnabled,
        accountId
      );

      const { success, value } = resUpdateAccount;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }

    if (toggle === "orderInAdvance") {
      const resUpdateAccount = await updateOrderInAdvanceToggleAccountServer(
        isToggleEnabled,
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
}
