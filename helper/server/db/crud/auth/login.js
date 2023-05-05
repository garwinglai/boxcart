import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function findUser(email) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		return { success: true, user };
	} catch (error) {
		return { success: false, error };
	}
}
