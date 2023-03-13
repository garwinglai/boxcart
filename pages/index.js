import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Home() {
	return (
		<>
			<Head>
				<title>Box Cart</title>
				<meta
					name="description"
					content="Create your next website in minutes."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<h1>Box Cart Leggo!</h1>
				<Link href="/account/signin">Login</Link>
			</main>
		</>
	);
}
