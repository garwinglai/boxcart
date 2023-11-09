import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { body } = req;

  const bodyParsed = JSON.parse(body);

  const {
    email,
    businessName,
    orderId,
    totalDisplay,
    totalItemsOrdered,
    orderForDateDisplay,
    customNote,
    orderLink,
  } = bodyParsed;

  const mailOptions = {
    to: email,
    from: {
      email: "hello@boxcart.shop",
      name: "BoxCart",
    },
    templateId: "d-f00dc1a94b66474d810362557f5e04f9",
    dynamic_template_data: {
      businessName,
      orderId,
      totalDisplay,
      totalItemsOrdered,
      orderForDateDisplay,
      customNote,
      orderLink,
    },
  };

  try {
    await sendgrid.send(mailOptions);
    console.log("sent");
  } catch (error) {
    console.log("Email send failed file:", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ error: "" });
}
