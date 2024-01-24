import prisma from "@/lib/prisma";
import { isAuthServer } from "@/helper/server/auth/isAuthServer";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  // const parsedBody = JSON.parse(body);

  if (method === "PATCH") {
    // Handle POST request
    const { lat, lng, geohash, accountId } = JSON.parse(body);
    const promises = [];

    const products = prisma.product.updateMany({
      where: {
        accountId,
      },
      data: {
        lat,
        lng,
        geohash,
      },
    });

    const digitalProducts = prisma.digitalProduct.updateMany({
      where: {
        accountId,
      },
      data: {
        lat,
        lng,
        geohash,
      },
    });

    promises.push(products);
    promises.push(digitalProducts);

    try {
      const results = await Promise.all(promises);
      res.status(200).json({ success: true, results });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
}
