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
    paymentMethod,
    customNote,
    orderLink,
    customerEmail,
    orderForTimeDisplay,
    createdAt,
  } = bodyParsed;

  const orderedOnDate = new Date(createdAt).toLocaleDateString();

  const mailOptions = {
    to: email,
    from: {
      email: "hello@boxcart.shop",
      name: "BoxCart",
    },
    reply_to: customerEmail,
    templateId: "d-f00dc1a94b66474d810362557f5e04f9",
    dynamic_template_data: {
      businessName,
      orderId,
      totalDisplay,
      totalItemsOrdered,
      paymentMethod,
      orderForDateDisplay,
      orderForTimeDisplay,
      customNote,
      orderLink,
      createdAt: orderedOnDate,
    },
  };

  try {
    await sendgrid.send(mailOptions);
  } catch (error) {
    console.log("Email send failed file:", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ error: "" });
}
