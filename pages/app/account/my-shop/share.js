import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import ShareIcon from "@mui/icons-material/Share";

function ShareShop() {
  return <div>share</div>;
}

export default ShareShop;

ShareShop.getLayout = function getLayout(
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
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </AppLayout>
  );
};

ShareShop.pageTitle = "Share shop";
ShareShop.pageIcon = (
  <ShareIcon sx={{ color: "var(--black-design-extralight)" }} />
);
ShareShop.pageRoute = "share-shop";
ShareShop.mobilePageRoute = "share-shop";
