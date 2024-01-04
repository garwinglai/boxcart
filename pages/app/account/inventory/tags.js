import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import tags_icon from "@/public/images/icons/account/tags_icon.png";
import Image from "next/image";

function Tags() {
  return <div>Tags</div>;
}

export default Tags;

Tags.getLayout = function getLayout(
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

Tags.pageTitle = "Tags";
Tags.pageIcon = (
  <div className="relative w-8 h-8">
    <Image
      src={tags_icon}
      alt="tags icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Tags.pageRoute = "tags";
Tags.mobilePageRoute = "tags";
