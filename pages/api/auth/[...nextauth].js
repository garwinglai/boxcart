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
		}),
		//...more providers  here.
	],
	callbacks: {
		async signIn({ account, profile }) {
			const { provider } = account;
			const googleProvider = "google";
			const appleProvider = "apple";
			const facebookProvider = "facebook";
			console.log("dob provider:", provider);

			// find user on signin
			const user = await prisma.user.findUnique({
				where: {
					email: "garwinglai@gmail.com",
				},
			});

			console.log("user on signin:", user);

			switch (provider) {
				case googleProvider:
					// user.fName is created during signup. user.fName ? signin : signup.
					if (!user.fName) {
						const signupResponse = await handleGoogleSignup(provider);
					} else {
						const signinResponse = await handleGoogleSignin(provider);
					}

					break;
				case appleProvider:
					break;
				case facebookProvider:
					break;

				default:
					break;
			}

			return true;
		},
		// async session({ session, token, user }) {},
	},
	pages: {
		signIn: "/auth/signin",
		// signOut: "/auth/signin",
		// newUser: "/auth/signin",
	},
};

export default NextAuth(options);

async function handleGoogleSignup(profile) {
	const { given_name, family_name, email, name } = profile;

	try {
		const userUpdate = await prisma.user.update({
			where: {
				email: email,
			},
			data: {
				fName: given_name,
				lName: family_name,
				waitlist: {
					create: {
						name: name,
						fName: given_name,
						lName: family_name,
						email: email,
						subdomain: "test.boxcart.shop",
					},
				},
			},
		});

		console.log("userUpdate:", userUpdate);
	} catch (error) {
		console.log("error update prisma:", error);
	}
}

async function handleGoogleSignin(provider) {}
