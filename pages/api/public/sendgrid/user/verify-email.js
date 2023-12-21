import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    const bodyParsed = JSON.parse(body);
    const { userId, shopperAccountId, email } = bodyParsed;

    const templateId = "d-d8e12c4a2d5649fe860cba3c0e0fff48";

    const mailOptions = {
      to: email,
      from: {
        email: "hello@boxcart.shop",
        name: "Beavr",
      },
      templateId,
      dynamic_template_data: {
        userId,
        shopperAccountId,
      },
    };

    try {
      await sendgrid.send(mailOptions);
    } catch (error) {
      console.log("Email send failed file: api/sendgrid/verify-email:", error);
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, error: "" });
  }
}
