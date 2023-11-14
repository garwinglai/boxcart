import React from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/AppLayout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { membershipPackages } from "@/helper/temp/tempData";

function Checkout() {
  const { push, query } = useRouter();
  const { planId, isPaymentByAnnual } = query;

  // TODO: 

  return (
    <div>
      {planId}, {isPaymentByAnnual}
    </div>
  );
}

export default Checkout;

Checkout.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <AppLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </AppLayout>
  );
};

Checkout.pageTitle = "Membership checkout";
Checkout.pageIcon = <ShoppingCartIcon />;
Checkout.pageRoute = "checkout";
Checkout.mobilePageRoute = "checkout";
