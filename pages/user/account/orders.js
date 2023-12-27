import React from "react";
import UserAccountLayout from "@/components/layouts/user/UserAccountLayout";
import orders_icon from "@/public/images/icons/user/orders_icon.png";
import Image from "next/image";
import { isAuthUserAccount } from "@/helper/server/auth/isAuth";
import prisma from "@/lib/prisma";
import OrderGridRowMobile from "@/components/user/account/orders/OrderGridRowMobile";
import OrderGridRowDesktop from "@/components/user/account/orders/OrderGridRowDesktop";
import beaver_icon from "@/public/images/icons/beaver_icon.png";

function Orders({ shopper }) {
  const { orders } = shopper;

  function mobileGridView() {
    return (
      <table className="grid grid-cols-4 w-full border-collapse lg:hidden">
        <thead className="contents">
          <tr className="contents">
            <th className="text-center w-full text-sm p-2 rounded-s-lg border-y border-l  mt-4 mb-2">
              Store
            </th>
            <th className="text-center w-full text-sm p-2 border-y mt-4 mb-2">
              Date
            </th>
            <th className="text-center w-full text-sm p-2 border-y mt-4 mb-2">
              Total
            </th>
            <th className="text-center w-full text-sm p-2 border-y border-r rounded-e-lg mt-4 mb-2">
              More
            </th>
          </tr>
        </thead>
        <tbody className=" contents">
          {orders.map((order, idx) => (
            <OrderGridRowMobile
              key={order.id}
              order={order}
              idx={idx}
              isMobile={true}
            />
          ))}
        </tbody>
      </table>
    );
  }

  function desktopGridView() {
    return (
      <table className="hidden lg:grid lg:grid-cols-8 w-full border-collapse">
        <thead className="contents">
          <tr className="contents">
            <th className="text-center w-full text-sm p-2 rounded-s-lg border-y border-l  mt-4 mb-2">
              Id
            </th>
            <th className="text-center w-full text-sm p-2 border-y mt-4 mb-2">
              Date
            </th>
            <th className="text-center w-full text-sm p-2 border-y mt-4 mb-2">
              Store
            </th>
            <th className="text-center w-full text-sm p-2 border-y mt-4 mb-2">
              Payment
            </th>
            <th className="text-center w-full text-sm p-2 border-y mt-4 mb-2">
              Type
            </th>
            <th className="text-center w-full text-sm p-2 border-y mt-4 mb-2">
              Action
            </th>
            <th className="text-center w-full text-sm p-2 border-y mt-4 mb-2">
              Total
            </th>
            <th className="text-center w-full text-sm p-2 border-y border-r rounded-e-lg mt-4 mb-2">
              More
            </th>
          </tr>
        </thead>
        <tbody className="contents">
          {orders.map((order, idx) => (
            <OrderGridRowDesktop
              key={order.id}
              order={order}
              idx={idx}
              isMobile={true}
            />
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="p-2">
      {/* <h2 className="text-base">History</h2> */}
      {mobileGridView()}
      {desktopGridView()}
      <div className="flex justify-center mt-16">
        <div className="relative w-10 h-10 animate-pulse">
          <Image
            src={beaver_icon}
            alt="beaver icon"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
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
            orderBy: {
              createdAt: "desc",
            },
            include: {
              account: {
                select: {
                  businessName: true,
                  email: true,
                  fullDomain: true,
                  logoImage: true,
                },
              },
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
