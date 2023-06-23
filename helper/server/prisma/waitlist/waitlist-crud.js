import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function checkSubdomainInUse(subdomain) {
	console.log("check", subdomain);
	try {
		const waitlist = await prisma.waitlist.findUnique({
			where: {
				subdomain,
			},
		});

		let hasWaitlist = false;
		if (waitlist) hasWaitlist = true;
		console.log("waitlist", waitlist);

		return { success: true, value: hasWaitlist, error: null };
	} catch (error) {
		console.log(
			"server error fetching waitlist helper/server/db/account/waitlist:",
			error
		);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"error fetching waitlist prismaError helper/server/db/account/waitlist:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}

export async function checkEmailInUseAPI(email) {
	try {
		const waitlist = await prisma.waitlist.findUnique({
			where: {
				email: email,
			},
		});

		let hasWaitlist = true;

		if (!waitlist) hasWaitlist = false;

		return { success: true, value: hasWaitlist, error: null };
	} catch (error) {
		console.log(
			"server error fetching waitlist helper/server/db/account/waitlist:",
			error
		);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"error fetching waitlist prismaError helper/server/db/account/waitlist:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}

export async function createWaitlistUser(body) {
	try {
		await prisma.waitlist.create({
			data: body,
		});

		return { success: true, value: null, error: null };
	} catch (error) {
		console.log(
			"server error post create waitlist helper/server/db/account/waitlist:",
			error
		);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"error post create waitlist prismaError helper/server/db/account/waitlist:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}
