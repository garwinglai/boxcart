import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import {
  createDatesAvailabilityServer,
  createDatesRangedAvailabilityServer,
  createDaysOfWeekAvailabilityServer,
  deleteDatesAvailabilityServer,
  deleteDatesRangedAvailabilityServer,
  deleteDayOfWeekAvailabilityServer,
  updateDatesAvailabilityServer,
  updateDatesRangeAvailabilityServer,
  updateDayOfWeekAvailabilityServer,
} from "@/helper/server/prisma/availability/availability-crud";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body, query } = req;
  if (method === "POST") {
    const { crud, scheduleType } = query;

    if (crud === "create") {
      const dates = JSON.parse(body);
      const { accountInfo } = query;
      if (scheduleType === "date") {
        const resDatesCreate = await createDatesAvailabilityServer(
          dates,
          accountInfo
        );
        const { success, value } = resDatesCreate;

        if (success) {
          res.status(200).json(value);
        } else {
          res.status(500).json(value);
        }
      }

      if (scheduleType === "ranged") {
        const resDatesCreate = await createDatesRangedAvailabilityServer(
          dates,
          accountInfo
        );
        const { success, value } = resDatesCreate;

        if (success) {
          res.status(200).json(value);
        } else {
          res.status(500).json(value);
        }
      }

      if (scheduleType === "weekday") {
        const resDatesCreate = await createDaysOfWeekAvailabilityServer(
          dates,
          accountInfo
        );
        const { success, value } = resDatesCreate;

        if (success) {
          res.status(200).json(value);
        } else {
          res.status(500).json(value);
        }
      }
    }

    if (crud === "delete") {
      const { scheduleId } = query;
      if (scheduleType === "date") {
        const resDelete = await deleteDatesAvailabilityServer(scheduleId);
        const { success, value } = resDelete;

        if (success) {
          res.status(200).json(value);
        } else {
          res.status(500).json(value);
        }
      }

      if (scheduleType === "ranged") {
        const resDelete = await deleteDatesRangedAvailabilityServer(scheduleId);
        const { success, value } = resDelete;

        if (success) {
          res.status(200).json(value);
        } else {
          res.status(500).json(value);
        }
      }

      if (scheduleType === "week") {
        const resDelete = await deleteDayOfWeekAvailabilityServer(scheduleId);
        const { success, value } = resDelete;

        if (success) {
          res.status(200).json(value);
        } else {
          res.status(500).json(value);
        }
      }
    }

    if (crud === "update") {
      const datesData = JSON.parse(body);
      if (scheduleType === "date") {
        const resDelete = await updateDatesAvailabilityServer(datesData);
        const { success, value } = resDelete;

        if (success) {
          res.status(200).json(value);
        } else {
          res.status(500).json(value);
        }
      }

      if (scheduleType === "range") {
        const resDelete = await updateDatesRangeAvailabilityServer(datesData);
        const { success, value } = resDelete;

        if (success) {
          res.status(200).json(value);
        } else {
          res.status(500).json(value);
        }
      }

      if (scheduleType === "week") {
        const resDelete = await updateDayOfWeekAvailabilityServer(datesData);
        const { success, value } = resDelete;

        if (success) {
          res.status(200).json(value);
        } else {
          res.status(500).json(value);
        }
      }
    }
  }
}
