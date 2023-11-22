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
  const { userAccount } = body;
  const {
    userName,
    firstName,
    lastName,
    address_1,
    address_2,
    city,
    state,
    zip,
    businessName,
    email,
    subdomain,
    fullDomain,
    businessBio,
  } = userAccount;

  // * Create Stripe Account
  const account = await stripe.accounts.create({
    type: "standard",
    email,
    business_profile: {
      name: businessName,
      product_description: businessBio,
      url: `https://${fullDomain}`,
      support_email: email,
      support_address: {
        line1: address_1,
        line2: address_2,
        city,
        state,
        postal_code: zip,
      },
    },
    settings: {
      payouts: {
        schedule: {
          interval: "manual",
        },
      },
    },
  });

  const { id } = account;

  res.status(200).json({ stripeAccountId: id });
}

// * test stripe pw: SUPERmonkeySUPERmonkey
// * stripe account code: fycw-tepx-bvpm-iqci-uagn
