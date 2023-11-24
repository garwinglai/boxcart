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

  const { query, method } = req;

  if (method === "GET") {
    try {
      const carriers = await shippo.carrieraccount.list({ carrier: "fedex" });

      res.status(200).json({ success: true, carriers });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, error });
    }
  }
}
