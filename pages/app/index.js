import { useSession } from "next-auth/react";
import React from "react";
import { signOut } from "next-auth/react";
import AppLayout from "@/components/layouts/AppLayout";

function App({ pageTitle }) {
	const data = useSession();

	const handleSignOut = () => {
		const signedOutRoute =
			process.env.NODE_ENV && process.env.NODE_ENV === "production"
				? "app.boxcart.shop/auth/signin"
				: "http://app.localhost:3000/auth/signin";

		signOut({
			callbackUrl: "http://app.localhost:3000/auth/signin",
		});
	};

	return (
		<>
			<h1>{pageTitle}</h1>
			<h1>BoxCart App Directory - app.localhost.com</h1>
			<button onClick={handleSignOut}>SignOut</button>
		</>
	);
}

export default App;

App.getLayout = function getLayout(page, pageTitle) {
	return <AppLayout pageTitle={pageTitle}>{page}</AppLayout>;
};

App.pageTitle = "App";
