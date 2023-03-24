import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

const options = {
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		maxAge: 60 * 60 * 24 * 2, // Seconds - 48 hours = 60s * 60m * 24h * 2d, how long until idle session expires.
		updateAge: 24 * 60 * 60, //Seconds - 24 hours = throttle how frequently to write to db to extend session.
		strategy: "jwt",
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "email",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				const { email, password } = credentials;

				const user = await loginUser(email, password);

				if (user) {
					return user;
				} else {
					return null;
				}
			},
		}),
		// * ...more providers  here.
	],
	callbacks: {
		async signIn({ account, profile }) {
			const { provider } = account;
			const googleProvider = "google";
			const appleProvider = "apple";
			const facebookProvider = "facebook";

			// find user on signin
			const user = await prisma.user.findUnique({
				where: {
					email: "garwinglai@gmail.com",
				},
			});

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
		async jwt({ token, account, profile }) {
			if (account) {
				console.log("jwt account", account);
				token.accessToken = account.access_token;
				token.id = profile.id;
			}
			return token;
		},
	},
	pages: {
		signIn: "/waitlist/create-account",
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
