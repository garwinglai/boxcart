import calculateAmountMinusStripeFee from "@/utils/stripe-fees";

// This is your test secret API key.
const secrey_key =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
const stripe = require("stripe")(secrey_key);

export default async function handler(req, res) {
  const { items } = req.body;
  const { stripeAccountId, amountPenny } = items[0];

  const stripeFeeRoundedPenny = calculateAmountMinusStripeFee(amountPenny);

  // Create a PaymentIntent with the order amount and currency
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountPenny, // In pennys
      currency: "usd",
      application_fee_amount: stripeFeeRoundedPenny, // In pennys.
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      payment_method: "pm_card_visa",
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
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
}