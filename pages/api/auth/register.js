import { createNewUser } from "@/helper/server/prisma/auth/registration";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const createUserResponse = await createNewUser(body);
    const { success } = createUserResponse;

    if (success) {
      res.status(200).json(createUserResponse);
    } else {
      res.status(500).json(createUserResponse);
    }
  }
}
