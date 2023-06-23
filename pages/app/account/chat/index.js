import React from "react";
import ChatIcon from "@mui/icons-material/Chat";
import AppLayout from "@/components/layouts/AppLayout";
import chat_icon from "@/public/images/icons/chat_icon.png";
import Image from "next/image";
import Link from "next/link";
import { isAuth } from "@/helper/client/auth/isAuth";

function Chat() {
	return (
		<div className="text-center mt-32">
			<Image
				src={chat_icon}
				alt="chat icon"
				className="w-20 h-20 opacity-50 mx-auto"
			/>
			<p className="font-light text-sm mt-4">Chat coming soon.</p>
			<p className="font-light text-sm mt-2">
				Checkout{" "}
				<span>
					<Link href="/account/newsroom" className="underline font-medium">
						Newsroom
					</Link>
				</span>{" "}
				for updates and <br /> business tips!
			</p>
		</div>
	);
}

export default Chat;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

Chat.getLayout = function getLayout(
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

Chat.pageTitle = "Chat";
Chat.pageIcon = <ChatIcon />;
Chat.pageRoute = "chat";
Chat.mobilePageRoute = "chat";
