import calculateAmountMinusStripeFee from "@/utils/stripe-fees";

// This is your test secret API key.
const secrey_key =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
const stripe = require("stripe")(secrey_key);

export default async function handler(req, res) {
  const { body, method } = req;
  const { items } = body;
  const { stripeAccountId, amountPenny, applicationFee } = items[0];

  if (method === "POST") {
    const stripeFeeRoundedPenny = calculateAmountMinusStripeFee(amountPenny);

    // Create a PaymentIntent with the order amount and currency
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountPenny,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        // payment_method: "pm_card_visa", // ! enable this for testing in local
        application_fee_amount: applicationFee + stripeFeeRoundedPenny,
        transfer_data: {
          destination: stripeAccountId,
        },
        on_behalf_of: stripeAccountId,
      });

      const { client_secret } = paymentIntent;

      res.send({
        clientSecret: client_secret,
      });
    } catch (e) {
      console.log("error", e.message);
      res.status(400).send({
        error: {
          message: e.message,
        },
      });
    }
  }
}
