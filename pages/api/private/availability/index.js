import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { getAvailabilitiesServer } from "@/helper/server/prisma/availability/availability-crud";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, query } = req;

  if (method === "GET") {
    const { availabilityId } = query;

    const resUpdateAccount = await getAvailabilitiesServer(availabilityId);

    const { success, value } = resUpdateAccount;

    if (success) {
      res.status(200).json(value);
    } else {
      res.status(500).json(value);
    }
  }
}
