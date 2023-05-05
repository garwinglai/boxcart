import { findUserAccessCode } from "@/helper/server/db/crud/account/early-bird-code";

export default async function handler(req, res) {
	// * early bird access code.
	const { slug } = req.query;
	const { method } = req;

	const earlyCode = slug;

	if (method === "GET") {
		const user = await findUserAccessCode(earlyCode);
		const { success, value, error } = user;

		if (success) {
			res.status(200).json(user);
		} else {
			res.status(500).json(user);
		}
	}
}
