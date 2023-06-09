import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Roboto_Flex, Archivo } from "next/font/google";

const robotoFlex = Roboto_Flex({ subsets: ["latin"] });
const archivo = Archivo({ subsets: ["latin"] });

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const pageTitle = Component.pageTitle;
	const pageRoute = Component.pageRoute;
	const mobilePageRoute = Component.mobilePageRoute;
	const pageIcon = Component.pageIcon;
	const getLayout = Component.getLayout || ((page) => page);
	const pageLayoutWithTitle = (
		page,
		pageTitle,
		pageIcon,
		pageRoute,
		mobilePageRoute
	) => getLayout(page, pageTitle, pageIcon, pageRoute, mobilePageRoute);

	return (
		<>
			<style jsx global>
				{`
					:root {
						--robotoFlex-font: ${robotoFlex.style.fontFamily};
						--archivo-font: ${archivo.style.fontFamily};
					}
				`}
			</style>
			<SessionProvider session={session}>
				{pageLayoutWithTitle(
					<Component {...pageProps} />,
					pageTitle,
					pageIcon,
					pageRoute,
					mobilePageRoute
				)}
			</SessionProvider>
		</>
	);
}
