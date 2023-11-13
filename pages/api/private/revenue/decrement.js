import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  if (method === "POST") {
    const { totalPenny, accountId, paymentMethod } = body;
    const id = parseInt(accountId);

    const updateData = buildUpdateData(paymentMethod, totalPenny);

    try {
      const revenue = await prisma.revenue.update({
        where: {
          accountId: id,
        },
        data: updateData,
      });
      res.status(200).json({ success: true, revenue });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ success: false, error });
    }
  }
}

const buildUpdateData = (paymentMethod, totalPenny) => {
  let updateData;

  switch (paymentMethod) {
    case "venmo":
      updateData = {
        totalBalancePenny: {
          decrement: totalPenny,
        },
        venmoRevenuePenny: {
          decrement: totalPenny,
        },
      };

      break;
    case "cash":
      updateData = {
        totalBalancePenny: {
          decrement: totalPenny,
        },
        cashRevenuePenny: {
          decrement: totalPenny,
        },
      };
      break;
    case "paypal":
      updateData = {
        totalBalancePenny: {
          decrement: totalPenny,
        },
        paypalRevenuePenny: {
          decrement: totalPenny,
        },
      };
      break;
    case "zelle":
      updateData = {
        totalBalancePenny: {
          decrement: totalPenny,
        },
        zelleRevenuePenny: {
          decrement: totalPenny,
        },
      };
      break;

    default: // stripe
      updateData = {
        totalBalancePenny: {
          decrement: totalPenny,
        },
        cardRevenuePenny: {
          decrement: totalPenny,
        },
      };
      break;
  }

  return updateData;
};
