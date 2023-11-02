import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === "POST") {
    const bodyParsed = JSON.parse(body);
    const {
      customerName,
      shopName,
      orderId,
      paymentMethod,
      fulfillmentDisplay,
      subtotalDisplay,
      taxAndFeesDisplay,
      totalDisplay,
      orderForDateDisplay,
      orderForTimeDisplay,
      deliveryAddress,
      email,
    } = bodyParsed;
    console.log("bodyParsed", bodyParsed);

    const now = new Date();

    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const dateString = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const createdAt = `${dateString}`;

    const mailOptions = {
      to: email,
      from: {
        email: "hello@boxcart.shop",
        name: "BoxCart",
      },
      templateId: "d-4298cbbafeaa49a4aaa4e6f0d9510225",
      dynamic_template_data: {
        customerName,
        // shopName,
        // createdAt,
        orderId,
        // paymentMethod,
        // fulfillmentDisplay,
        // subtotalDisplay,
        // taxAndFeesDisplay,
        // totalDisplay,
        // orderForDateDisplay,
        // orderForTimeDisplay,
      },
    };

    try {
      await sendgrid.send(mailOptions);
      console.log("sent");
    } catch (error) {
      console.log("Email send failed file: api/sendgrid/verify-email:", error);
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, error: "" });
  }
}
