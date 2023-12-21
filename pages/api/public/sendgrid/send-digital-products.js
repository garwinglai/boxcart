import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    const bodyParsed = JSON.parse(body);
    const {
      customerName,
      businessName,
      email,
      businessLogo,
      businessEmail,
      shopperEmail,
    } = bodyParsed;

    const mailOptions = {
      to: email,
      from: {
        email: "hello@boxcart.shop",
        name: businessName,
      },
      reply_to: businessEmail,
      templateId: "d-d265a05341174195b50335878332d034",
      dynamic_template_data: {
        businessName,
        businessLogo,
        customerName,
        customerEmail: shopperEmail,
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
