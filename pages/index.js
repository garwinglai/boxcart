import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();
	// console.log("data session", session, status);
	return (
		<>
			<Head>
				<title>BoxCart | Simple Storefront</title>
				<meta
					name="description"
					content="Create your next website in minutes."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{!session ? (
				<>
					<h1>User Logged out.</h1>
					<button onClick={() => router.push("/auth/create-account")}>
						Sign in.
					</button>
					<br />
					<br />
					<br />
					<br />
					<h1>1 reserve shop</h1>
					<h2>2reserve shop</h2>
					<h3>3 reserve shop</h3>
					<h4>4 reserve shop</h4>
					<h5>5 reserve shop</h5>
					<h6>6 reserve shop</h6>
					<br />
					<br />
					<br />
					<p>p you reserved this name</p>
				</>
			) : (
				<main>
					<h1>User Logged in</h1>
					<button
						onClick={() => signOut({ callbackUrl: "/auth/create-account" })}
					>
						Sign out.
					</button>
				</main>
			)}
		</>
	);
}
