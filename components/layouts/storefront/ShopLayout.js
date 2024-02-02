import React, { useEffect, useState } from "react";
import ShopNavTop from "./ShopNavTop";
import { storeVersion } from "@/helper/temp/tempData";
import { getLocalStorage, setLocalStorage } from "@/utils/clientStorage";
import BoxLoader from "@/components/global/loaders/BoxLoader";

function ShopLayout({ children }) {
  const [isLoadingVersion, setIsLoadingVersion] = useState(false);

  // useEffect(() => {
  //   const currentVersion = getLocalStorage("version store");

  //   if (!currentVersion) {
  //     updateShopperVersion();
  //   } else {
  //     if (currentVersion !== storeVersion.value) {
  //       updateShopperVersion();
  //     }
  //     setIsLoadingVersion(false);
  //   }
  // }, []);

  const updateShopperVersion = () => {
    setLocalStorage("version store", storeVersion.value);
    window.location.reload();
    setIsLoadingVersion(false);
    return;
  };

  return isLoadingVersion ? (
    <div className="flex flex-col gap-2 justify-center items-center mt-28">
      <BoxLoader />
      <p>boxcart shop loading...</p>
    </div>
  ) : (
    <div>
      <ShopNavTop />
      <main>{children}</main>
    </div>
  );
}

export default ShopLayout;
