import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Roboto_Flex, Archivo } from "next/font/google";

const robotoFlex = Roboto_Flex({ subsets: ["latin"] });
const archivo = Archivo({ subsets: ["latin"] });

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
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
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
}
