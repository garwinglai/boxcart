import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export default NextAuth({
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		maxAge: 60 * 60 * 24 * 2, // Seconds - 48 hours = 60s * 60m * 24h * 2d, how long until idle session expires.
		updateAge: 24 * 60 * 60, //Seconds - 24 hours = throttle how frequently to write to db to extend session.
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		//...more providers  here.
	],
	pages: {
		signIn: "/auth/signin",
		// signOut: "/auth/signin",
		//newUser : can set a page for first time sign in
	},
});
