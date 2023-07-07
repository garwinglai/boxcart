import { findWaitlistEarlyBirdCode } from "@/helper/server/prisma/waitlist";

export default async function handler(req, res) {
  // * early bird access code.
  const { slug } = req.query;
  const { method } = req;

  const earlyCode = slug;

  if (method === "GET") {
    const user = await findWaitlistEarlyBirdCode(earlyCode);

    const { success, value, error } = user;

    if (success) {
      res.status(200).json(user);
    } else {
      res.status(500).json(user);
    }
  }
}
