import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
	// const router = useRouter();

	// useEffect(() => {
	// 	router.push("https://www.home.boxcart.shop");
	// }, []);

	return (
		<>
			<Head>
				<title>BoxCart | Simple Storefront</title>
				{/* <meta
					name="description"
					content="Create your next website in minutes."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" /> */}
				{/* <link rel="icon" href="/favicon.ico" /> */}
			</Head>
			<h1>hello world - home/index</h1>
		</>
	);
}

// export async function getServerSideProps(ctx) {
// 	return {
// 		redirect: {
// 			permanent: false,
// 			destination: "https://home.boxcart.shop",
// 		},
// 	};
// }
