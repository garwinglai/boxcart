import { isAuthServer } from "@/helper/server/auth/isAuthServer";

const secretKey =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
const pubslishableKey =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.STRIPE_LIVE_PUBLISHABLE_KEY;

const stripe = require("stripe")(secretKey);

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { body } = req;
  const { stripeAccountId } = JSON.parse(body);

  // * Retrieve Stripe Account

  const account = await stripe.accounts.retrieve(stripeAccountId);

  res.status(200).json({ account });
}
