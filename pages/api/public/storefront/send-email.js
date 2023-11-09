import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    // const bodyParsed = JSON.parse(body);
    const {
      fName,
      lName,
      message,
      email: customerEmail,
      businessName,
      businessEmail,
    } = body;

    const customerName = `${fName} ${lName}`;

    const mailOptions = {
      to: businessEmail,
      from: {
        email: "hello@boxcart.shop",
        name: "BoxCart",
      },
      reply_to: customerEmail,
      templateId: "d-c22bd407243a452b8414d8029a4f8747",
      dynamic_template_data: {
        customerName,
        message,
        businessName,
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
