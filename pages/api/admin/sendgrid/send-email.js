import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    const { senderName, fromEmail, toEmail, receiverName, subject } = body;
    const refactorSenderName = " " + senderName;

    // return;
    const templateId = "d-92afccebf3d942c5a1711bf75afae0ba";

    const mailOptions = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: senderName,
      },
      reply_to: fromEmail,
      templateId,
      dynamic_template_data: {
        subject,
        senderName: refactorSenderName,
        receiverName,
        boxcartLink: "https://home.boxcart.shop/add-your-business",
      },
    };

    try {
      await sendgrid.send(mailOptions);

      res.status(200).json({ success: true, error: "" });
    } catch (error) {
      console.log("Email send failed file: api/sendgrid/verify-email:", error);
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}
