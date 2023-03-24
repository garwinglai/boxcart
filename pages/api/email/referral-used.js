import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendReferralUsedEmail(req, res) {
	const { body } = req;

	const bodyParsed = JSON.parse(body);
	const { referrer, referred } = bodyParsed;

	const mailOptions = {
		to: referrer.value.email,
		from: "hello@boxcart.shop",
		templateId: "d-41226cbc586d4885bd422368b3eb7efc",
		dynamic_template_data: {
			accessPerson: referred.name,
			referralCode: referred.codeUsed,
		},
	};

	try {
		await sendgrid.send(mailOptions);
		console.log("Email sent file: api/email/referral-used", mailOptions);
	} catch (error) {
		console.log("Email send failed file: api/email/referral-used:", error);
		return res.status(error.statusCode || 500).json({ error: error.message });
	}

	return res.status(200).json({ error: "" });
}
