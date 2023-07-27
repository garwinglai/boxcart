import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { updatePaymentServer } from "@/helper/server/prisma/payments/payment-crud";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;
  if (method === "POST") {
    const paymentData = JSON.parse(body);

    const resPaymentUpdate = await updatePaymentServer(paymentData);
    const { success, value } = resPaymentUpdate;

    if (success) {
      res.status(200).json(value);
    } else {
      res.status(500).json(value);
    }
  }
}
