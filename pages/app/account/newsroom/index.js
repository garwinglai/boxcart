import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import article_icon from "@/public/images/icons/article_icon.png";
import Image from "next/image";
import { isAuth } from "@/helper/server/auth/isAuth";
// import prisma from "@/lib/prisma";

function NewsRoom() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 border-b pb-4">
        <Image src={article_icon} alt="article icon" className="w-12 h-12" />
        <h4>Updates, news, & helpful tips!</h4>
      </div>
      <p className="text-center font-base text-sm mt-16">
        Here&apos;s where you will find business tips, feature updates, and more!
      </p>
      <p className="text-center font-bold text-sm mt-4">Coming soon ...</p>
      {/* <div className="pt-4">
				<h4>Updates:</h4>
				<ul className="py-4 pr-4 pl-8">
					<li className="text-sm list-disc underline">8/8/2023</li>
					<ul className="mt-2">
						<li className="list-disc text-sm ml-4">Chat</li>
						<li className="list-disc text-sm ml-4"></li>
					</ul>
				</ul>
			</div>
			<div>
				<h4>Articles:</h4>
			</div> */}
    </div>
  );
}

export default NewsRoom;

export async function getServerSideProps(context) {
  return isAuth(context, (userSession) => {
    return {
      props: {
        userSession,
      },
    };
  });
}

NewsRoom.getLayout = function getLayout(
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

NewsRoom.pageTitle = "Newsroom";
NewsRoom.pageIcon = <NewspaperIcon />;
NewsRoom.pageRoute = "news-room";
NewsRoom.mobilePageRoute = "news-room";
