import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const { customerEmail, accountId, shopperId } = body;

    const subscriber = await findSubscriberByEmail(customerEmail);

    if (subscriber && subscriber.accounts.length > 0) {
      // Check if already subscribed
      const accountSubbed = subscriber.accounts.find(
        (account) => account.id === accountId
      );

      if (accountSubbed) {
        const { subscribers } = accountSubbed;

        if (shopperId) {
          // If already subscribed and user is logged in, check if the subscription is connected to user. If not, connect it.
          const shopperAccountSubbed = subscribers.find(
            (subscriber) => subscriber.shopperAccountId === parseInt(shopperId)
          );

          if (!shopperAccountSubbed) {
            try {
              await prisma.shopperAccount.update({
                where: {
                  id: parseInt(shopperId),
                },
                data: {
                  subscribes: {
                    connect: {
                      email: customerEmail,
                    },
                  },
                },
              });
              res.status(200).json({ message: "success" });
              return;
            } catch (error) {
              console.log("error connecting", error);
              if (error instanceof Prisma.PrismaClientKnownRequestError) {
                const prismaError = {
                  code: error.code,
                  message: error.message,
                  target: error.meta,
                };

                console.log("prismaError", prismaError.code);

                res.status(500).json({ errorCode: prismaError.code });
                return;
              }

              res.status(500).json({ message: "error" });
              return;
            }
          }
        }
        res.status(200).json({ errorCode: "P2002" });
        return;
      }
    }

    const data = shopperId
      ? {
          email: customerEmail,
          shopperAccount: {
            connect: { id: parseInt(shopperId) },
          },
        }
      : { email: customerEmail };

    try {
      await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          subscriberCount: {
            increment: 1,
          },
          subscribers: {
            connectOrCreate: {
              where: { email: customerEmail },
              create: {
                ...data,
              },
            },
          },
        },
      });

      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log("error", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = {
          code: error.code,
          message: error.message,
          target: error.meta,
        };

        console.log("prismaError", prismaError.code);

        res.status(500).json({ errorCode: prismaError.code });
        return;
      }

      res.status(500).json({ message: "error" });
    }
  }
}

const findSubscriberByEmail = async (customerEmail) => {
  try {
    return await prisma.subscriber.findFirst({
      where: {
        email: customerEmail,
      },
      include: {
        accounts: {
          include: {
            subscribers: {
              include: {
                shopperAccount: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log("error finding email", error);
    return null;
  }
};
