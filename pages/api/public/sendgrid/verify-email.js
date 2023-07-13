import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    const bodyParsed = JSON.parse(body);
    const { userId, accountId, email } = bodyParsed;
    console.log("bodyParsed:", bodyParsed);

    const mailOptions = {
      to: email,
      from: {
        email: "hello@boxcart.shop",
        name: "BoxCart",
      },
      templateId: "d-3d14c29ed81b4bd395748a4e7e96d739",
      dynamic_template_data: {
        userId,
        accountId,
      },
    };

    try {
      await sendgrid.send(mailOptions);
      console.log("Email sent file: api/sendgrid/verify-email", mailOptions);
    } catch (error) {
      console.log("Email send failed file: api/sendgrid/verify-email:", error);
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, error: "" });
  }
}
