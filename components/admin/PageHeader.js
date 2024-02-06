import React, { useState } from "react";
import Logo from "../Logo";
import ButtonPrimary from "../global/buttons/ButtonPrimary";
import ButtonFourth from "../global/buttons/ButtonFourth";
import ButtonThird from "../global/buttons/ButtonThird";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/fireConfig";
import BoxLoader from "../global/loaders/BoxLoader";
import Link from "next/link";

function PageHeader() {
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();

  const signOutUser = () => {
    setIsLoading(true);

    signOut(auth)
      .then(() => {
        // Sign-out successful.
        push("/admin/auth/signin");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
        window.alert(error);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex justify-between items-center p-4 shadow">
      <Link href="/admin" className="flex items-center gap-1">
        <div className="w-8 h-8 relative">
          <Logo />
        </div>
        <h1 className="text-[color:var(--primary)]">boxcart</h1>
      </Link>
      <div>
        {isLoading ? (
          <BoxLoader />
        ) : (
          <ButtonThird
            handleClick={signOutUser}
            name="sign out"
            type="button"
          />
        )}
      </div>
    </div>
  );
}

export default PageHeader;
