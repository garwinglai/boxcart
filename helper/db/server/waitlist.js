import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function checkSubdomainInUse(subdomain) {
	try {
		const waitlist = await prisma.waitlist.findUnique({
			where: {
				subdomain: subdomain,
			},
		});

		let hasWaitlist = true;

		if (!waitlist) hasWaitlist = false;

		return { success: true, value: hasWaitlist, error: null };
	} catch (error) {
		console.log(
			"server error fetching waitlist api/waitlist/[subdomain]:",
			error
		);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"error fetching waitlist prismaError api/waitlist/subdomain:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}

export async function checkEmailInUse(email) {
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
			"server error fetching waitlist api/waitlist/[subdomain]:",
			error
		);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"error fetching waitlist prismaError api/waitlist/subdomain:",
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
			"server error post create waitlist api/waitlist/[subdomain]:",
			error
		);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = {
				code: error.code,
				message: error.message,
				target: error.meta,
			};

			console.log(
				"error post create waitlist prismaError api/waitlist/subdomain:",
				prismaError
			);

			return { success: false, value: null, error: prismaError };
		} else {
			return { success: false, value: null, error: error };
		}
	}
}
