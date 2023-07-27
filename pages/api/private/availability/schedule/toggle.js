import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import {
  updateEnableDateScheduleServer,
  updateEnableRangeScheduleServer,
  updateEnableWeekScheduleServer,
} from "@/helper/server/prisma/availability/schedule-toggle";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body, query } = req;

  if (method === "POST") {
    const updatedSchedulesArr = JSON.parse(body);
    const { scheduleType } = query;

    if (scheduleType === "date") {
      const resUpdateAccount = await updateEnableDateScheduleServer(
        updatedSchedulesArr
      );

      const { success, value } = resUpdateAccount;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }

    if (scheduleType === "range") {
      const resUpdateAccount = await updateEnableRangeScheduleServer(
        updatedSchedulesArr
      );

      const { success, value } = resUpdateAccount;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }

    if (scheduleType === "week") {
      const resUpdateAccount = await updateEnableWeekScheduleServer(
        updatedSchedulesArr
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
