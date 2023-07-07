import { findSubdomainAccount } from "@/helper/server/prisma/account/findSubdomain";

export default async function handler(req, res) {
	const { slug } = req.query;
	const { method } = req;
	const subdomain = slug;

	if (method === "GET") {
		const user = await findSubdomainAccount(subdomain);
		const { success, value, error } = user;

		if (success) {
			res.status(200).json(user);
		} else {
			res.status(500).json(user);
		}
	}
}
