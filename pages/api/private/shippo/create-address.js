import { isAuthServer } from "@/helper/server/auth/isAuthServer";

const shippoToken =
  process.env.NODE_ENV === "development"
    ? process.env.SHIPPO_TEST_TOKEN
    : process.env.SHIPPO_LIVE_TOKEN;

const shippo = require("shippo")(shippoToken);

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }
  const { method } = req;

  if (method === "POST") {
    const { body } = req;
    const { email, name } = body;

    try {
      const address = await shippo.address.create({
        name: "Shawn Ippotle",
        company: "Shippo",
        street1: "215 Clayton St.",
        city: "San Francisco",
        state: "CA",
        zip: "94117",
        country: "US", // iso2 country code
        phone: "+1 555 341 9393",
        email: "shippotle@shippo.com",
      });

      res.status(200).json({ success: true, address });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error });
    }
  }
}
