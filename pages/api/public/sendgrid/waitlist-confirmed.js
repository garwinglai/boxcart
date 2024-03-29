import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendWaitlistConfirmedEmail(req, res) {
  const { body } = req;

  const {
    email,
    reservationNo,
    subdomain,
    accessCode,
    fName,
    // referralCode,
  } = JSON.parse(body);

  const mailOptions = {
    to: email,
    from: {
      email: "hello@boxcart.shop",
      name: "BoxCart",
    },
    templateId: "d-5ad77589c6fc47a7b4ef0238e459243d",
    dynamic_template_data: {
      name: fName,
      reservationNo,
      subdomain,
      accessCode,
      // referralCode,
    },
  };

  try {
    await sendgrid.send(mailOptions);
  } catch (error) {
    console.log(
      "Sendgrid error from file: api/sendgrid/waitlist-confirmed:",
      error
    );
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ error: "" });
}
