import React, { useState } from "react";
import UserAccountLayout from "@/components/layouts/user/UserAccountLayout";
import subs_icon from "@/public/images/icons/user/subs_icon.png";
import Image from "next/image";
import { isAuthUserAccount } from "@/helper/server/auth/isAuth";
import prisma from "@/lib/prisma";
import SubCard from "@/components/user/account/subs/SubCard";

function Subs({ subs }) {
  const [accounts, setAccounts] = useState(subs ? subs.accounts : []);

  const setAccountData = (data) => {
    setAccounts(data);
  };

  return (
    <div className="p-4 gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {accounts.map((account, index) => (
        <SubCard
          key={account.id}
          account={account}
          setAccountData={setAccountData}
          subEmail={subs.email}
        />
      ))}
    </div>
  );
}

export default Subs;

export async function getServerSideProps(context) {
  return isAuthUserAccount(context, async (userSession) => {
    const { user } = userSession;
    const { name, email, id } = user;
    let serializedSubs = null;

    try {
      const subs = await prisma.subscriber.findUnique({
        where: {
          email,
        },
        include: {
          accounts: {
            select: {
              id: true,
              businessName: true,
              fullDomain: true,
              logoImage: true,
              businessBio: true,
            },
          },
        },
      });

      if (subs) {
        serializedSubs = JSON.parse(JSON.stringify(subs));
      }
    } catch (error) {
      console.log(error);
    }

    return {
      props: {
        subs: serializedSubs,
      },
    };
  });
}

Subs.getLayout = function getLayout(
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

Subs.pageTitle = "Subs";
Subs.pageIcon = (
  <div className="relative w-8 h-8  ">
    <Image
      src={subs_icon}
      alt="subcribed icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Subs.pageRoute = "subs";
Subs.mobilePageRoute = "subs";
