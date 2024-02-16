import { nanoid } from "nanoid";

// This is your test secret API key.
const secrey_key =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
const stripe = require("stripe")(secrey_key);

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    const { taxCalculationId, paymentIntentId } = body;

    // Create a PaymentIntent with the order amount and currency
    try {
      const taxTransactionObject =
        await stripe.tax.transactions.createFromCalculation({
          calculation: taxCalculationId,
          reference: paymentIntentId,
          expand: ["line_items"],
        });

      res.status(200).send({
        taxTransactionObject,
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
