import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function findUserReferralCode(code) {
	try {
		const user = await prisma.waitlist.findUnique({
			where: {
				referralCode: code,
			},
		});

		let hasReferCode = true;
		if (!user) hasReferCode = false;

		return { success: true, value: hasReferCode, error: null };
	} catch (error) {
		console.log("file: helper/db/server. findUserReferralCode error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"file: helper/db/server. findUserReferralCode prismError error:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}

export async function updateReferralUser(codeUsed) {
	try {
		const user = await prisma.waitlist.update({
			where: {
				referralCode: codeUsed,
			},
			data: {
				numberReferred: { increment: 1 },
			},
		});

		return { success: true, value: user, error: null };
	} catch (error) {
		console.log("file: helper/db/server. updateReferralUser error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"file: helper/db/server. updateReferralUser prismaError error:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}
