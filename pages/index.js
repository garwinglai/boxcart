import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		try {
			const response = await fetch("/api/stars", {
				method: "GET",
			});

			if (response.status === 200) {
				console.log(await response.json());
			}
		} catch (e) {
			console.log("error", e);
		}
	};

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
			<main>
				<h1>Box Cart Leggo!</h1>
				<Link href="/account/signin">Login</Link>
			</main>
		</>
	);
}
