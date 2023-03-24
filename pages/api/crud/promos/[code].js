import {
	findUserReferralCode,
	updateReferralUser,
} from "@/helper/db/server/promo-codes";

// * API Handler
export default async function handler(req, res) {
	const { code } = req.query;
	const { method } = req;

	if (method === "GET") {
		const user = await findUserReferralCode(code);
		const { success, value, error } = user;
		const response = { value, error };

		if (success) {
			res.status(200).json(response);
		} else {
			res.status(500).json(response);
		}
	}

	if (method === "POST") {
		// const { body } = req;
		const updatedUser = await updateReferralUser(code);
		const { success, value, error } = updatedUser;
		const response = { value, error };

		if (success) {
			res.status(200).json(response);
		} else {
			res.status(500).json(response);
		}
	}
}
