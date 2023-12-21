import UserAccountLayout from "@/components/layouts/user/UserAccountLayout";
import React from "react";
import wishlist_icon from "@/public/images/icons/user/wishlist_icon.png";
import Image from "next/image";
import { isAuthUserAccount } from "@/helper/server/auth/isAuth";

function Wishlist() {
  return <div>Wishlist</div>;
}

export default Wishlist;

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

Wishlist.getLayout = function getLayout(
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

Wishlist.pageTitle = "Wishlist";
Wishlist.pageIcon = (
  <div className="relative w-10 h-10">
    <Image
      src={wishlist_icon}
      alt="wishlist icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Wishlist.pageRoute = "wishlist";
Wishlist.mobilePageRoute = "wishlist";
