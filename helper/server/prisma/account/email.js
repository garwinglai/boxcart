import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function findEmailWaitlist(email) {
	try {
		const user = await prisma.waitlist.findUnique({
			where: {
				email: email,
			},
		});

		return { success: true, value: user, error: null };
	} catch (error) {
		console.log(
			"server error fetching email helper/server/db/account/email:",
			error
		);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"error fetching email prismaError helper/server/db/account/email:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}

export async function findEmailAccount(email) {
	try {
		const user = await prisma.account.findUnique({
			where: {
				email: email,
			},
		});

		return { success: true, value: user, error: null };
	} catch (error) {
		console.log(
			"server error fetching email helper/server/db/account/email:",
			error
		);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"error fetching email prismaError helper/server/db/account/email:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}
