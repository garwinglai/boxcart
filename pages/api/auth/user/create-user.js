import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const { userData } = body;
    const { password } = userData;

    console.log("password", password);

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log("has", hash);

    try {
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hash,
        },
        include: {
          shopperAccount: true,
        },
      });

      res.status(200).json({ success: true, user });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = {
          code: error.code,
          message: error.message,
          target: error.meta,
        };

        console.log("prismaError", prismaError.code);

        res.status(500).json({ success: false, error: prismaError.code });
        return;
      }
      console.log("error", error);

      res.status(500).json({ success: false, error: "error" });
    }
  }
}
