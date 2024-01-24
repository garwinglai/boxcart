import UserAccountLayout from "@/components/layouts/user/UserAccountLayout";
import React from "react";
import cart_icon from "@/public/images/icons/user/cart_icon.png";
import Image from "next/image";
import { isAuthUserAccount } from "@/helper/server/auth/isAuth";

function Cart() {
  return <div>Cart</div>;
}

export default Cart;

export async function getServerSideProps(context) {
  return isAuthUserAccount(context, async (userSession) => {
    const { user } = userSession;
    const { name, email, id } = user;
    let serializedAccount;

    return {
      props: {},
    };
  });
}

Cart.getLayout = function getLayout(
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

Cart.pageTitle = "Cart";
Cart.pageIcon = (
  <div className="relative w-8 h-8  md:w-10 md:h-10">
    <Image
      src={cart_icon}
      alt="subcribed icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Cart.pageRoute = "cart";
Cart.mobilePageRoute = "cart";
