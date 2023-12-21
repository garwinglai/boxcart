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

  const { body } = req;
  const { stripeId } = JSON.parse(body);

  const refresh_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/app/account/my-shop/payments"
      : "https://boxcart.shop/app/account/my-shop/payments";

  const return_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/app/account/my-shop/payments"
      : "https://boxcart.shop/app/account/my-shop/payments";

  const accountLink = await stripe.accountLinks.create({
    account: stripeId,
    refresh_url,
    return_url,
    type: "account_onboarding",
  });

  const { url } = accountLink;

  res.status(200).json({ url });
}

// * test stripe pw: SUPERmonkeySUPERmonkey1
// * stripe account code: dfzc-wtjc-qwdn-hbav-dmkp
