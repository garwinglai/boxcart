import { isAuthServer } from "@/helper/server/auth/isAuthServer";

const secretKey =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;

const stripe = require("stripe")(secretKey);

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }
  const { method } = req;

  if (method === "POST") {
    const { body } = req;
    console.log("body", body);
    const { stripeAccountId } = JSON.parse(body);
    console.log(stripeAccountId);
    console.log(typeof stripeAccountId);

    try {
      const deleted = await stripe.accounts.del(stripeAccountId);
      res.status(200).json({ success: true, deleted });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
