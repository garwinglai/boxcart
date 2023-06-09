import React from "react";
import ChatIcon from "@mui/icons-material/Chat";
import AppLayout from "@/components/layouts/AppLayout";

function Chat() {
	return <div>Chat</div>;
}

export default Chat;

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
