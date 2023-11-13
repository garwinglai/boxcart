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

    const createData = buildCreateData(paymentMethod, totalPenny, id);
    const updateData = buildUpdateData(paymentMethod, totalPenny);

    try {
      const revenue = await prisma.revenue.upsert({
        where: {
          accountId: id,
        },
        update: updateData,
        create: createData,
      });
      res.status(200).json({ success: true, revenue });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ success: false, error });
    }
  }
}

const buildCreateData = (paymentMethod, totalPenny, id) => {
  const createData = {
    totalBalancePenny: totalPenny,
    venmoRevenuePenny: 0,
    cashRevenuePenny: 0,
    paypalRevenuePenny: 0,
    zelleRevenuePenny: 0,
    cardRevenuePenny: 0,
    account: {
      connect: {
        id,
      },
    },
  };

  switch (paymentMethod) {
    case "venmo":
      createData.venmoRevenuePenny = totalPenny;
      break;
    case "cash":
      createData.cashRevenuePenny = totalPenny;
      break;
    case "paypal":
      createData.paypalRevenuePenny = totalPenny;
      break;
    case "zelle":
      createData.zelleRevenuePenny = totalPenny;
      break;

    default: // stripe
      createData.cardRevenuePenny = totalPenny;
      break;
  }

  return createData;
};

const buildUpdateData = (paymentMethod, totalPenny) => {
  let updateData;

  switch (paymentMethod) {
    case "venmo":
      updateData = {
        totalBalancePenny: {
          increment: totalPenny,
        },
        venmoRevenuePenny: {
          increment: totalPenny,
        },
      };

      break;
    case "cash":
      updateData = {
        totalBalancePenny: {
          increment: totalPenny,
        },
        cashRevenuePenny: {
          increment: totalPenny,
        },
      };
      break;
    case "paypal":
      updateData = {
        totalBalancePenny: {
          increment: totalPenny,
        },
        paypalRevenuePenny: {
          increment: totalPenny,
        },
      };
      break;
    case "zelle":
      updateData = {
        totalBalancePenny: {
          increment: totalPenny,
        },
        zelleRevenuePenny: {
          increment: totalPenny,
        },
      };
      break;

    default: // stripe
      updateData = {
        totalBalancePenny: {
          increment: totalPenny,
        },
        cardRevenuePenny: {
          increment: totalPenny,
        },
      };
      break;
  }

  return updateData;
};
