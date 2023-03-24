import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendWaitlistConfirmedEmail(req, res) {
	const { body } = req;

	const {
		email,
		reservationNo,
		subdomain,
		earlyBirdCode,
		fName,
		referralCode,
	} = JSON.parse(body);

	const mailOptions = {
		to: email,
		from: "hello@boxcart.shop",
		templateId: "d-5ad77589c6fc47a7b4ef0238e459243d",
		dynamic_template_data: {
			name: fName,
			reservationNo,
			subdomain,
			earlyBirdCode,
			referralCode,
		},
	};

	try {
		await sendgrid.send(mailOptions);
		console.log("Email sent file: api/email/waitlist-confirmed", mailOptions);
	} catch (error) {
		console.log(
			"Sendgrid error from file: api/email/waitlist-confirmed:",
			error
		);
		return res.status(error.statusCode || 500).json({ error: error.message });
	}

	return res.status(200).json({ error: "" });
}
