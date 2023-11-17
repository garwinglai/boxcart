import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/AppLayout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CircularProgress from "@mui/material/CircularProgress";
import CheckoutFormStripe from "@/components/membership/CheckoutFormStripe";
import { useMembershipStore } from "@/lib/store";
import { isAuth } from "@/helper/client/auth/isAuth";
import prisma from "@/lib/prisma";
import { useHasHydrated } from "@/utils/useHasHydrated";
import CheckmarkGif from "@/public/videos/checkmark.gif";
import Image from "next/image";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";

const publishable_key =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(publishable_key);

function Checkout({ premiumPlan }) {
  const hydrated = useHasHydrated();

  const membershipProductStore = useMembershipStore(
    (state) => state.membershipProduct
  );
  const membershipPriceStore = useMembershipStore(
    (state) => state.membershipPrice
  );

  const [subscribed, setSubscribed] = useState(false);

  const { push } = useRouter();

  const handleIsSubscribed = () => {
    setSubscribed(true);
  };

  useEffect(() => {
    if (
      Object.keys(membershipProductStore).length === 0 ||
      Object.keys(membershipPriceStore).length === 0
    ) {
      push("/account/premium/membership");
    }
  }, []);

  const handleViewMembership = () => {
    push("/account/premium/membership");
  };

  const options = {
    mode: "subscription",
    amount: 0,
    currency: "usd",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };

  return (
    <div>
      {subscribed ? (
        <div className="flex flex-col justify-center items-center gap-2 mt-16">
          <div className="w-20 h-20 relative aspect-square">
            <Image
              src={CheckmarkGif}
              alt="checkmark"
              fill
              priority
              className=" object-cover rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3>Success!</h3>
          <p>You have successfull subscribed</p>
          <div>
            <ButtonPrimary
              handleClick={handleViewMembership}
              name="View membership"
            />
          </div>
        </div>
      ) : (
        hydrated &&
        Object.keys(membershipProductStore).length !== 0 &&
        Object.keys(membershipPriceStore).length !== 0 && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutFormStripe
              membership={membershipProductStore}
              price={membershipPriceStore}
              premiumPlan={premiumPlan}
              handleIsSubscribed={handleIsSubscribed}
            />
          </Elements>
        )
      )}
    </div>
  );
}

export default Checkout;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;
    let serializedPlan;
    let accountId = parseInt(id);

    try {
      const plan = await prisma.premiumPlan.findUnique({
        where: {
          accountId,
        },
      });

      serializedPlan = JSON.parse(JSON.stringify(plan));
    } catch (error) {
      console.log("serversideprops membership error:", error);
      serializedAccount = null;
    }

    return {
      props: {
        userSession,
        premiumPlan: serializedPlan,
      },
    };
  });
}

Checkout.getLayout = function getLayout(
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

Checkout.pageTitle = "Membership checkout";
Checkout.pageIcon = <ShoppingCartIcon />;
Checkout.pageRoute = "checkout";
Checkout.mobilePageRoute = "checkout";
