import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { findUser } from "@/helper/server/prisma/auth/login";

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
			async authorize(credentials) {
				const { email, password } = credentials;

				const userResponse = await findUser(email);
				const { success, user, error } = userResponse;

				if (!success || (success && !user)) {
					console.log("err finding user in [...nextauth] line 45:", error);
					return null;
				}

				if (success && user) {
					const hash = user.password;

					try {
						const isPasswordValid = await confirmPasswordHashpassword(
							password,
							hash
						);

						if (!isPasswordValid) {
							return null;
						}

						const userData = {
							userId: user.id,
							firstName: user.firstName,
							lastName: user.lastName,
							name: user.name,
							email: user.email,
							emailVerified: user.emailVerified,
						};

						return userData;
					} catch (error) {
						console.log("error checking hash [...nextauth] line 73:", error);
						return null;
					}
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			// user only passes through the first time user logs in.
			// Add any data to token. Token gets called in session callback to use.
			if (user) {
				token.id = user.userId;
				return token;
			}

			return token;
		},
		async session({ token, session }) {
			// add additional token data to sesssion and return session when session is called.
			session.user.id = token.id;
			return session;
		},
	},
	pages: {
		signIn: "http://app.localhost:3000/auth/signin",
		error: "http://app.localhost:3000/auth/signin",
	},
};

export default NextAuth(options);
