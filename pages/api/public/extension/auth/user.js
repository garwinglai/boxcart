import { isAuthUserAccount } from "@/helper/server/auth/isAuth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { options } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "GET") {
    try {
      const session = await getServerSession(req, res, options);
      console.log("session", session);
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      return res.status(200).json({ session });
    } catch (error) {
      console.error("Error in API route:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // If the method is not GET, respond with a 405 Method Not Allowed
  return res.status(405).json({ message: "Method Not Allowed" });
}
