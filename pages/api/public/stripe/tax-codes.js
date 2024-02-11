// This is your test secret API key.
const secrey_key =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
const stripe = require("stripe")(secrey_key);

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      let taxCodes = [];
      let hasMore = true;
      let startingAfter;

      while (hasMore) {
        const response = await stripe.taxCodes.list({
          limit: 100, // Adjust the limit based on your needs
          starting_after: startingAfter,
        });

        taxCodes = taxCodes.concat(response.data);
        startingAfter =
          response.data.length > 0
            ? response.data[response.data.length - 1].id
            : null;
        hasMore = response.has_more;
      }

      res.status(200).send({
        taxCodes,
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
