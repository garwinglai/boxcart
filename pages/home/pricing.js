import React from "react";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import MembershipPage from "@/components/membership/MembershipPage";
import boxcart_logo from "@/public/images/logos/boxcart_logo_full.png";
import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";

const secretKey =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
const pubslishableKey =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY;

const stripe = require("stripe")(secretKey);

function Pricing({ stripePrices, stripeProducts }) {
  return (
    <div className="px-4 py-4 pb-24 bg-[color:var(--purple-bg)] min-h-screen md:px-8 lg:px-32">
      <Link href="https://www.boxcart.site">
        <div className="w-32 h-32 absolute -top-6  left-0 md:w-48 md:h-48 md:-top-14">
          <Image
            src={boxcart_logo}
            alt="boxcart logo"
            fill
            className="object-cover w-full h-full"
          />
        </div>
      </Link>
      <div className="mt-8 md:mt-0">
        <MembershipPage
          stripePrices={stripePrices}
          stripeProducts={stripeProducts}
          isPublic={true}
        />
      </div>
      <Link
        href="https://app.boxcart.shop/auth/signin"
        className="absolute right-4 top-4 md:top-5 md:right-10"
      >
        <ButtonPrimary name="Sign in" />
      </Link>
    </div>
  );
}

export default Pricing;

export async function getServerSideProps(context) {
  const promises = [];
  let stripeProducts;
  let stripePrices;

  const products = stripe.products.list();
  promises.push(products);

  const prices = stripe.prices.list();
  promises.push(prices);

  try {
    const [products, prices] = await Promise.all(promises);

    stripeProducts = products.data;
    stripePrices = prices.data;
  } catch (error) {
    console.log("serversideprops membership error:", error);

    stripeProducts = null;
    stripePrices = null;
  }

  return {
    props: {
      stripeProducts,
      stripePrices,
    },
  };
}
