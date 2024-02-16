import calculateAmountMinusStripeFee from "@/utils/stripe-fees";

// This is your test secret API key.
const secrey_key =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
const stripe = require("stripe")(secrey_key);

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    const {
      paymentIntentId,
      taxCalcId,
      total,
      taxAndFees,
      applicationFeePenny,
    } = body;

    const stripeFeeRoundedPenny = calculateAmountMinusStripeFee(total);

    try {
      const paymentIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        {
          amount: total,
          application_fee_amount:
            applicationFeePenny + stripeFeeRoundedPenny + taxAndFees,
          metadata: {
            tax_calculation: taxCalcId,
          },
        }
      );

      const { id, client_secret } = paymentIntent;

      res.send({
        clientSecret: client_secret,
        paymentIntentId: id,
      });
    } catch (e) {
      console.log("error", e);
      res.status(400).send({
        error: {
          message: e.message,
        },
      });
    }
  }
}
