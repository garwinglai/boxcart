import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// * API Handler
export default async function handler(req, res) {
	const { slug } = req.query;
	const { method } = req;

	const slugLength = slug.length;

	if (method === "GET") {
		//  Check subdomain in use.
		if (slugLength == 1) {
			const subdomain = slug[0];

			const checkSubDomainResponse = await checkSubdomainInUse(subdomain);
			const { success, value, error } = checkSubDomainResponse;

			const response = { value, error };

			if (success) {
				res.status(200).json(response);
			} else {
				res.status(500).json(response);
			}
		}

		// Check email in use.
		if (slugLength == 2) {
			const email = slug[1];
			const checkEmailResponse = await checkEmailInUse(email);
			const { success, value, error } = checkEmailResponse;

			const response = { value, error };

			if (success) {
				res.status(200).json(response);
			} else {
				res.status(500).json(response);
			}
		}
	}

	if (method === "POST") {
		const { body } = req;
		const createResponse = await createWaitlistUser(body);
		const { success, value, error } = createResponse;

		const response = { success, error };

		if (success) {
			res.status(200).json(response);
		} else {
			res.status(500).json(response);
		}
	}
}

// * Helper functions
async function checkSubdomainInUse(subdomain) {
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

async function checkEmailInUse(email) {
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

async function createWaitlistUser(body) {
	try {
		console.log("body server:", body);
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
