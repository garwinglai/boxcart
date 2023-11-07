import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { isAuth } from "@/helper/client/auth/isAuth";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

function GfitCard() {
  return (
    <div className="flex flex-col justify-center items-center mt-16">
      <h3>Gift cards coming soon...</h3>
    </div>
  );
}

export default GfitCard;

export async function getServerSideProps(context) {
  return isAuth(context, (userSession) => {
    return {
      props: {
        userSession,
      },
    };
  });
}

GfitCard.getLayout = function getLayout(
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

GfitCard.pageTitle = "Gift card";
GfitCard.pageIcon = <CardGiftcardIcon />;
GfitCard.pageRoute = "gift-card";
GfitCard.mobilePageRoute = "gift-card";
