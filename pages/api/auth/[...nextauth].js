import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

const options = {
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
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
		//...more providers  here.
	],
	callbacks: {
		async signIn({ account, profile, metadata }) {
			if (account.provider === "google") {
				console.log("server side google Account:", account);
				console.log("server side google Arofile:", profile);

				return profile.email_verified && profile.email.endsWith("gmail.com");
			}
			return true;
		},
	},
	pages: {
		signIn: "/auth/create-account",
		// signOut: "/auth/signin",
		//newUser : can set a page for first time sign in
	},
};

export default NextAuth(options);
