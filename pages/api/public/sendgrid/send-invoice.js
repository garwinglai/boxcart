import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    const bodyParsed = JSON.parse(body);
    const {
      customerName,
      businessName,
      orderId,
      paymentMethod,
      fulfillmentDisplay,
      deliveryAddress,
      pickupAddress,
      pickupNote,
      email,
      businessLogo,
      paymentAccount,
      paymentInstructions,
      businessEmail,
      subtotalDisplay,
      totalDisplay,
      taxAndFeesDisplay,
      deliveryFeeDisplay,
      orderItems,
      orderForTimeDisplay,
      orderForDateDisplay,
      createdAt,
    } = bodyParsed;

    const orderedOnDate = new Date(createdAt).toLocaleDateString();

    const mailOptions = {
      to: email,
      from: {
        email: "hello@boxcart.shop",
        name: businessName,
      },
      reply_to: businessEmail,
      templateId: "d-4298cbbafeaa49a4aaa4e6f0d9510225",
      dynamic_template_data: {
        businessName,
        businessLogo,
        orderId,
        customerName,
        fulfillmentDisplay,
        deliveryAddress,
        pickupNote,
        pickupAddress,
        paymentMethod,
        paymentAccount,
        paymentInstructions,
        subtotalDisplay,
        totalDisplay,
        taxAndFeesDisplay,
        deliveryFeeDisplay,
        orderItems,
        orderForTimeDisplay,
        orderForDateDisplay,
        createdAt: orderedOnDate,
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
