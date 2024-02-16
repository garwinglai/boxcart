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
    const { billingAddress, cart, deliveryFeePenny } = body;

    // Create a PaymentIntent with the order amount and currency
    try {
      const salesTaxObject = await stripe.tax.calculations.create({
        currency: "usd",
        customer_details: {
          address: {
            ...billingAddress,
          },
          address_source: "billing",
        },
        line_items: cart.map((item) => {
          const id = nanoid();

          return {
            amount: item.pricePenny,
            quantity: item.quantity,
            tax_code: item.productTaxCode,
            reference: item.productName + " " + id,
          };
        }),
        shipping_cost: {
          amount: deliveryFeePenny,
        },
        expand: ["line_items"],
      });

      res.status(200).send({
        salesTaxObject,
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
