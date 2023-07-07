import {
  findEmailWaitlist,
  findEmailAccount,
} from "@/helper/server/prisma/account/email";

export default async function handler(req, res) {
  const { method, query } = req;
  const { slug: email, purpose } = query;

  if (purpose === "checkWaitlist") {
    if (method === "GET") {
      const findEmailResponse = await findEmailWaitlist(email);
      const { success, value, error } = findEmailResponse;

      if (success) {
        res.status(200).json(findEmailResponse);
      } else {
        res.status(500).json(findEmailResponse);
      }
    }
  }

  if (purpose === "checkAccount") {
    if (method === "GET") {
      const findEmailResponse = await findEmailAccount(email);
      const { success, value, error } = findEmailResponse;

      if (success) {
        res.status(200).json(findEmailResponse);
      } else {
        res.status(500).json(findEmailResponse);
      }
    }
  }
}
