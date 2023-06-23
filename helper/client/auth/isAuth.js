import { options } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function isAuth(context, next) {
	const session = await getServerSession(context.req, context.res, options);
	const serializedSession = JSON.parse(JSON.stringify(session));

	if (!session) {
		return {
			redirect: {
				destination:
					process.env.NODE_ENV && process.env.NODE_ENV === "production"
						? "/auth/signin"
						: "http://app.localhost:3000/auth/signin",
				permanent: false,
			},
		};
	}

	return next(serializedSession);
}
