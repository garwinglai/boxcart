import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updateStripeSetupComplete } from "@/helper/server/prisma/payments/payment-crud";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;
  if (method === "POST") {
    const data = JSON.parse(body);

    const resStripePaymentUpdate = await updateStripeSetupComplete(data);
    const { success, value, error } = resStripePaymentUpdate;

    if (success) {
      res.status(200).json(value);
    } else {
      res.status(500).json(error);
    }
  }
}
