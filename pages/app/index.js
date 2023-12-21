import { useSession } from "next-auth/react";
import React from "react";
import { signOut } from "next-auth/react";
import AppLayout from "@/components/layouts/AppLayout";
import { useRouter } from "next/router";

function App({ pageTitle }) {
  const { data, status } = useSession();
  const { push } = useRouter();

  if (status === "unauthenticated") push("/app/auth/signin");

  const handleSignOut = async () => {
    const res = await signOut({ redirect: false });
    push("/app/auth/signin");
  };

  return (
    <>
      <h1>{pageTitle}</h1>
      <button onClick={handleSignOut}>SignOut</button>
    </>
  );
}

export default App;

export async function getServerSideProps(context) {
  const redirectUrl =
    process.env.NODE_ENV && process.env.NODE_ENV === "production"
      ? "https://boxcart.shop/app/account/my-shop"
      : "http://localhost:3000/app/account/my-shop";

  return {
    redirect: {
      destination: redirectUrl,
      permanent: false,
    },
  };
}

App.getLayout = function getLayout(page, pageTitle) {
  return <AppLayout pageTitle={pageTitle}>{page}</AppLayout>;
};

App.pageTitle = "App";
