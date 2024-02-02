import { verifyAccessCode } from "@/helper/server/prisma/codes";

export default async function handler(req, res) {
  // * early bird access code.
  const { code } = req.query;
  const { method } = req;

  if (method === "GET") {
    const user = await verifyAccessCode(code);

    const { success, value, error } = user;

    if (success) {
      res.status(200).json(user);
    } else {
      res.status(500).json(user);
    }
  }
}
