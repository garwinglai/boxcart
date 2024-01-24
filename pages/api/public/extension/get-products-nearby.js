import prisma from "@/lib/prisma";
import { calculateBoundingBox } from "@/utils/location";

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === "GET") {
    const { userLat, userLng, distance, lastProductId } = query;
    const lat = parseFloat(userLat);
    const lng = parseFloat(userLng);
    const pageSize = 10; // Adjust the page size as needed
    // const offset = (pageNumber - 1) * pageSize;

    const boundingBox = calculateBoundingBox(lat, lng, distance);
    const { southwest, northeast } = boundingBox;

    try {
      let products;
      let newLastProductId;

      if (lastProductId === "undefined" || !lastProductId) {
        // First fetch

        products = await prisma.$queryRaw`
        SELECT 
          p.*,
          a.fullDomain,
          a.businessName,
          a.businessIdentities,
          ST_distance_sphere(point(${lng}, ${lat}), point(p.lng, p.lat)) * 0.0006213371192 AS distanceToUser
        FROM Product p
        JOIN Account a ON p.accountId = a.id
        WHERE isEnabled = true
          AND p.lat BETWEEN ${southwest.lat} AND ${northeast.lat} 
          AND p.lng BETWEEN ${southwest.lng} AND ${northeast.lng}
          AND ST_distance_sphere(point(${lng}, ${lat}), point(p.lng, p.lat)) * 0.0006213371192 < ${distance}
        ORDER BY p.id
        LIMIT ${pageSize}
        `;

        newLastProductId = products[products.length - 1]?.id; // Update the lastProductId for subsequent fetches
      } else {
        // Subsequent fetch
        products = await prisma.$queryRaw`
        SELECT 
          p.*,
          a.fullDomain,
          a.businessName,
          a.businessIdentities,
          ST_distance_sphere(point(${lng}, ${lat}), point(p.lng, p.lat)) * 0.0006213371192 AS distanceToUser
        FROM Product p
        JOIN Account a ON p.accountId = a.id
        WHERE isEnabled = true
          AND p.lat BETWEEN ${southwest.lat} AND ${northeast.lat} 
          AND p.lng BETWEEN ${southwest.lng} AND ${northeast.lng}
          AND ST_distance_sphere(point(${lng}, ${lat}), point(p.lng, p.lat)) * 0.0006213371192 < ${distance}
          AND p.id > ${lastProductId}
        ORDER BY p.id
        LIMIT ${pageSize}
      `;

        newLastProductId = products[products.length - 1]?.id; // Update the lastProductId for subsequent fetches
      }

      res.status(200).json({ products, newLastProductId });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
