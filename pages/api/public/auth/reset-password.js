import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { email, password } = req.body;

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  try {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hash,
      },
    });

    return res.status(200).json({ success: true, value: user });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ success: false, error });
  }
}
