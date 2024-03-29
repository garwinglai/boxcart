import { isAuthServer } from "@/helper/server/auth/isAuthServer";

const secretKey =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
const pubslishableKey =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY;

const stripe = require("stripe")(secretKey);

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { query } = req;
  const { stripeAccId } = query;

  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: stripeAccId,
    });

    res.status(200).json({ success: true, balance });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error });
  }
}
