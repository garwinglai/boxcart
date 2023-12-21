import UserAccountLayout from "@/components/layouts/user/UserAccountLayout";
import React from "react";
import likes_icon from "@/public/images/icons/user/likes_icon.png";
import Image from "next/image";
import { isAuthUserAccount } from "@/helper/server/auth/isAuth";

function Likes() {
  return <div>Likes</div>;
}

export default Likes;

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

Likes.getLayout = function getLayout(
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

Likes.pageTitle = "Likes";
Likes.pageIcon = (
  <div className="relative w-10 h-10">
    <Image
      src={likes_icon}
      alt="likes icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Likes.pageRoute = "likes";
Likes.mobilePageRoute = "likes";
