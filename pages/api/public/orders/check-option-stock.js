import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method, query } = req;
  const { optionId } = query;

  if (method === "GET") {
    try {
      const option = await prisma.option.findUnique({
        where: {
          id: parseInt(optionId),
        },
      });

      res.status(200).json({ option });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error });
    }
  }
}
