import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function findUserAccessCode(code) {
	try {
		const user = await prisma.waitlist.findUnique({
			where: {
				earlyBirdCode: code,
			},
		});

		return { success: true, value: user, error: null };
	} catch (e) {
		console.log(
			"file: helper/server/db/early-bird-code, findUserAccessCode Error:",
			e
		);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"file: helper/server/db/early-bird-code, findUserAccessCode prisma error:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}
