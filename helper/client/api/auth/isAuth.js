import { useSession } from "next-auth/react";
import { options } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function isAuth(context, next) {
	const session = await getServerSession(context.req, context.res, options);
	const serializedSesson = JSON.parse(JSON.stringify(session));

	if (!session) {
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false,
			},
		};
	}

	return next(serializedSesson);
}
