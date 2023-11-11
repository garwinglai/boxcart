import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    const bodyParsed = JSON.parse(body);
    const { email, fourDigitCode } = bodyParsed;

    const signInLink =
      process.env.NODE_ENV === "production"
        ? "https://app.boxcart.shop/auth/signin"
        : "http://app.localhost:3000/auth/signin";

    const mailOptions = {
      to: email,
      from: {
        email: "hello@boxcart.shop",
        name: "BoxCart",
      },
      templateId: "d-f52222d2942e473da9a50e81f437bb0d",
      dynamic_template_data: {
        signInLink,
        token: fourDigitCode,
        email,
      },
    };

    try {
      await sendgrid.send(mailOptions);
    } catch (error) {
      console.log("Email send failed:", error);
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, error: "" });
  }
}
