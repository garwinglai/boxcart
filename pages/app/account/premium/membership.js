import React, { useState, useEffect } from "react";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AppLayout from "@/components/layouts/AppLayout";
import MembershipPage from "@/components/membership/MembershipPage";
import { isAuth } from "@/helper/server/auth/isAuth";
import prisma from "@/lib/prisma";

function MemberShip({ userAccount, stripePrices, stripeProducts }) {
  const [hasSubScription, setHasSubScription] = useState(true);

  useEffect(() => {
    let ignore = false;
    if (ignore) return;

    const { premiumPlan } = userAccount || {};

    if (!premiumPlan) {
      setHasSubScription(false);
      return;
    }

    const retrieveSub = async () => {
      const getSubApi = `/api/private/stripe/retrieve-subscription/${premiumPlan.stripeSubscriptionId}`;

      const res = await fetch(getSubApi, {
        method: "GET",
      });
      const sub = await res.json();

      if (!sub.success || sub.error) {
        setHasSubScription(false);
        return;
      }

      const { plan } = sub.subscription;

      if (!plan.active) {
        setHasSubScription(false);
        return;
      }

      // * this can be used for the future when adding more product subscriptions.
      const { product, id: priceId } = plan;
      setHasSubScription(true);
    };

    retrieveSub();

    return () => (ignore = true);
  }, []);
  return (
    <div className="">
      <MembershipPage
        stripePrices={stripePrices}
        stripeProducts={stripeProducts}
        userAccount={userAccount}
        isPublic={false}
        hasSubScription={hasSubScription}
      />
    </div>
  );
}

export default MemberShip;

const secretKey =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
const pubslishableKey =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY;

const stripe = require("stripe")(secretKey);

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;
    let serializedAccount;
    let stripeProducts;
    let stripePrices;

    const promises = [];

    const userAccount = prisma.account.findUnique({
      where: {
        email,
      },
      include: {
        acceptedPayments: true,
        revenue: true,
        payout: true,
        premiumPlan: true,
      },
    });
    promises.push(userAccount);

    const products = stripe.products.list();
    promises.push(products);

    const prices = stripe.prices.list();
    promises.push(prices);

    try {
      const [account, products, prices] = await Promise.all(promises);

      if (!account) {
        return {
          redirect: {
            destination:
              process.env.NODE_ENV && process.env.NODE_ENV === "production"
                ? "/app/auth/signin"
                : "http://localhost:3000/app/auth/signin",
            permanent: false,
          },
        };
      }

      serializedAccount = JSON.parse(JSON.stringify(account));
      stripeProducts = products.data.filter((product) => product.active);
      stripePrices = prices.data;
    } catch (error) {
      console.log("serversideprops membership error:", error);
      serializedAccount = null;
      stripeProducts = null;
      stripePrices = null;
    }

    return {
      props: {
        userSession,
        userAccount: serializedAccount,
        stripeProducts,
        stripePrices,
      },
    };
  });
}

MemberShip.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <AppLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </AppLayout>
  );
};

MemberShip.pageTitle = "MemberShip";
MemberShip.pageIcon = <CardMembershipIcon />;
MemberShip.pageRoute = "membership";
MemberShip.mobilePageRoute = "membership";
