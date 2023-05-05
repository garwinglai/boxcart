import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function findSubdomainUser(subdomain) {
	console.log("subdomain handler", subdomain);
	try {
		const user = await prisma.account.findUnique({
			where: {
				subdomain,
			},
		});

		let hasUser = false;
		if (user) hasUser = true;
		console.log("user find subdomain", user);

		return { success: true, value: hasUser, error: null };
	} catch (error) {
		console.log(
			"server error fetching waitlist helper/server/db/account/checksubdomain:",
			error
		);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"error fetching waitlist prismaError helper/server/db/account/checksubdomain:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}
