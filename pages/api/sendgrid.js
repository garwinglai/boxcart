import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
	console.log("Server, sending email.");
	const { body } = req;

	const { email, reservationNo, subdomain, earlyBirdCode, fName } =
		JSON.parse(body);

	const mailOptions = {
		to: email,
		from: "hello@boxcart.shop",
		templateId: "d-5ad77589c6fc47a7b4ef0238e459243d",
		dynamic_template_data: {
			name: fName,
			reservationNo: reservationNo,
			subdomain: subdomain,
			earlyBirdCode: earlyBirdCode,
		},
	};

	try {
		await sendgrid.send(mailOptions);
		console.log("Sendgrid email sent", mailOptions);
	} catch (error) {
		console.log("sending sendGrid email error, server:", error);
		return res.status(error.statusCode || 500).json({ error: error.message });
	}

	return res.status(200).json({ error: "" });
}

export default sendEmail;
