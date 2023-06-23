import { findEmail } from "@/helper/server/prisma/account/email";

export default async function handler(req, res) {
	const { slug } = req.query;
	const { method } = req;

	const email = slug;

	if (method === "GET") {
		const findEmailResponse = await findEmail(email);
		const { success, value, error } = findEmailResponse;

		if (success) {
			res.status(200).json(findEmailResponse);
		} else {
			res.status(500).json(findEmailResponse);
		}
	}
}
