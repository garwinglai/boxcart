import Cors from "micro-cors";
import prisma from "../../../lib/prisma";

const cors = Cors({
  origin: "*", // Set to the appropriate origin(s) for better security
  methods: ["GET"],
});

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      // Fetch products using Prisma
      const products = await prisma.product.findMany({
        include: {
          account: {
            select: {
              fullDomain: true,
            },
          },
        },
      });

      // Respond with CORS headers
      cors(req, res, () => {
        res.status(200).json({ products });
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
