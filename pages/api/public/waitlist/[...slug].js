import {
	checkSubdomainInUse,
	checkEmailInUseAPI,
	createWaitlistUser,
} from "@/helper/server/prisma/waitlist";

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

			if (success) {
				res.status(200).json(checkSubDomainResponse);
			} else {
				res.status(500).json(checkSubDomainResponse);
			}
		}

		// Check email in use.
		if (slugLength == 2) {
			const email = slug[1];
			const checkEmailResponse = await checkEmailInUseAPI(email);
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
