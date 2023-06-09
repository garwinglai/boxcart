import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function updateEmailIsVerifiedUser(id) {
	const idInt = parseInt(id);
	console.log("id", id);
	try {
		const updatedUser = await prisma.user.update({
			where: {
				id: idInt,
			},
			data: {
				emailVerified: true,
			},
		});

		return { success: true, value: updatedUser };
	} catch (error) {
		console.log(
			"helper/client/api/account updateEmailIsVerified error:",
			error
		);

		return { success: false, error };
	}
}

export async function updateEmailIsVerifiedUser(id) {
	const idInt = parseInt(id);
	console.log("id", id);

	// This will update all Accounts related to User with userId. This is okay because verify-email page is protected. Each time a new account is created, it will have !emailVerified. They will have to revisit this page to verify the email, which will verify email for all Accounts.

	try {
		const updatedUser = await prisma.account.update({
			where: {
				userId: idInt,
			},
			data: {
				emailVerified: true,
			},
		});

		return { success: true, value: updatedUser };
	} catch (error) {
		console.log(
			"helper/client/api/account updateEmailIsVerified error:",
			error
		);

		return { success: false, error };
	}
}

export async function updateUserIsActive(id) {
	const idInt = parseInt(id);
	try {
		const updatedUser = await prisma.user.update({
			where: {
				id: idInt,
			},
			data: {
				isActive: true,
			},
		});

		return { success: true, value: updatedUser };
	} catch (error) {
		console.log("helper/client/api/account/updateUserIsActive error:", error);

		return { success: false, error };
	}
}
