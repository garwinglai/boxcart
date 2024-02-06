import React from "react";
import PageHeader from "@/components/admin/PageHeader";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/fireConfig";
import { useRouter } from "next/router";
import { useAdminStore } from "@/lib/store";
import BoxLoader from "@/components/global/loaders/BoxLoader";

function AdminLayout({ children }) {
  const setAdminUser = useAdminStore((state) => state.setAdminUser);
  const [loadingUser, setLoadingUser] = useState(true);

  const { push } = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setAdminUser(user);
        setLoadingUser(false);
      } else {
        // User is signed out
        push("/admin/auth/signin");
      }
    });
  }, [auth]);

  return (
    <div>
      {loadingUser ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-2">
          <BoxLoader />
          <p>Loading admin...</p>
        </div>
      ) : (
        <React.Fragment>
          <PageHeader />
          <main>{children}</main>
        </React.Fragment>
      )}
    </div>
  );
}

export default AdminLayout;
