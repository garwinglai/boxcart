import { useSession } from "next-auth/react";
import React from "react";
import { signOut } from "next-auth/react";
import AppLayout from "@/components/layouts/AppLayout";
import { useRouter } from "next/router";

function App({ pageTitle }) {
  const { data, status } = useSession();
  const { push } = useRouter();

  if (status === "unauthenticated") push("/auth/signin");

  const handleSignOut = async () => {
    // const signedOutRoute =
    // 	process.env.NODE_ENV && process.env.NODE_ENV === "production"
    // 		? "app.boxcart.shop/auth/signin"
    // 		: "http://app.localhost:3000/auth/signin";

    const res = await signOut({ redirect: false });
    push("/auth/signin");
  };

  return (
    <>
      <h1>{pageTitle}</h1>
      <h1>BoxCart App Directory - app.localhost.com</h1>
      <button onClick={handleSignOut}>SignOut</button>
    </>
  );
}

export default App;

export async function getServerSideProps(context) {
  const redirectUrl =
    process.env.NODE_ENV && process.env.NODE_ENV === "production"
      ? "https://app.boxcart.shop/account/my-shop"
      : "http://app.localhost:3000/account/my-shop";

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
