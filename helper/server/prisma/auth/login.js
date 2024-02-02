import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function findUser(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    });

    console.log("user:", user);

    return { success: true, user };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
}
