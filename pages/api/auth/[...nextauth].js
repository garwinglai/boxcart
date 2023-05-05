import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { findUser } from "@/helper/server/db/crud/auth/login";

const confirmPasswordHashpassword = (plainPassword, hashedPassword) => {
	return new Promise((resolve) => {
		bcrypt.compare(plainPassword, hashedPassword, function (err, res) {
			resolve(res);
		});
	});
};

export const options = {
	cookie: {
		secure: process.env.NODE_ENV && process.env.NODE_ENV === "production",
	},
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		maxAge: 60 * 60 * 24 * 2, // Seconds - 48 hours = 60s * 60m * 24h * 2d, how long until idle session expires.
		updateAge: 24 * 60 * 60, //Seconds - 24 hours = throttle how frequently to write to db to extend session.
		strategy: "jwt",
	},
	providers: [
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

				console.log("authorize", email, password);

				const userResponse = await findUser(email);
				const { success, user, error } = userResponse;

				if (!success || (success && !user)) {
					console.log("authorization error, [...nextauth]:", error);
					return null;
				}

				if (success) {
					if (user) {
						const hash = user.password;

						try {
							const isPasswordValid = await confirmPasswordHashpassword(
								password,
								hash
							);
							console.log("isPasswordValid", isPasswordValid);

							if (isPasswordValid) {
								const userData = {
									userId: user.id,
									firstName: user.firstName,
									lastName: user.lastName,
									name: user.name,
									email: user.email,
									emailVerified: user.emailVerified,
									isActive: user.isActive,
								};
								console.log("userdata authorized:", userData);
								return userData;
							}

							if (!isPasswordValid) {
								console.log("[...nextauth] hash not matched logging in.");
								return null;
							}
						} catch (error) {
							console.log("error checking hash.");
							return null;
						}
					}
				}
			},
		}),
		// * ...more providers  here.
	],
	callbacks: {
		async signIn({ user, account }) {
			if (user) {
				return true;
			} else {
				return false;
			}
		},
		async jwt({ token, user, account }) {
			console.log("jwt callback", token, user, account);
			if (user) {
				return user;
			}
		},
		async session({ session }) {
			console.log("session callback", session);
			const user = session.user;

			if (user) {
				return session;
			}
		},
	},
	pages: {
		signIn: "/waitlist/create-account",
		signUp: "/account/signup",
		// signOut: "/auth/signin",
		// newUser: "/auth/signin",
	},
};

export default NextAuth(options);
