import UserAccountLayout from "@/components/layouts/user/UserAccountLayout";
import React from "react";
import orders_icon from "@/public/images/icons/user/orders_icon.png";
import Image from "next/image";
import { isAuthUserAccount } from "@/helper/server/auth/isAuth";
import prisma from "@/lib/prisma";
import { serialize } from "swr/_internal";

function Orders({ shopper }) {
  return <pre>{JSON.stringify(shopper, null, 2)}</pre>;
}

export default Orders;

export async function getServerSideProps(context) {
  return isAuthUserAccount(context, async (userSession) => {
    const { user } = userSession;
    const { name, email, id } = user;
    let serializedAccount;

    try {
      const shopper = await prisma.shopperAccount.findUnique({
        where: {
          email,
        },
        include: {
          orders: {
            include: {
              orderItems: {
                include: {
                  digitalProduct: {
                    include: {
                      digitalFiles: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      serializedAccount = JSON.parse(JSON.stringify(shopper));
    } catch (error) {
      console.log(error);
      serializedAccount = null;
    }

    return {
      props: {
        shopper: serializedAccount,
      },
    };
  });
}

Orders.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <UserAccountLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </UserAccountLayout>
  );
};

Orders.pageTitle = "Orders";
Orders.pageIcon = (
  <div className="relative w-10 h-10">
    <Image
      src={orders_icon}
      alt="orders icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Orders.pageRoute = "orders";
Orders.mobilePageRoute = "orders";
