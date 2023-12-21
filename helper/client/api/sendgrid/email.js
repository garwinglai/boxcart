export async function sendWaitlistConfirmedEmail(finalValues) {
  const resSendgrid = await fetch("/api/public/sendgrid/waitlist-confirmed", {
    method: "POST",
    body: JSON.stringify(finalValues),
  });
}

export async function sendEmailReferUsed(referrer, referred) {
  const body = {
    referrer,
    referred,
  };

  await fetch("/api/sendgrid/referral-used", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function sendShopperVerificationEmail(
  userId,
  shopperAccountId,
  email
) {
  const verificationEmailUrl = "/api/public/sendgrid/user/verify-email";
  const data = {
    userId,
    shopperAccountId,
    email,
  };

  const result = await fetch(verificationEmailUrl, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const resultJson = await result.json();
  const { success, error } = resultJson;

  if (result.status == 200) {
    return { success, error };
  } else {
    return { success, error };
  }
}

export async function sendBusinessVerificationEmail(userId, accountId, email) {
  const verificationEmailUrl = "/api/public/sendgrid/verify-email";
  const data = {
    userId,
    accountId,
    email,
  };

  const result = await fetch(verificationEmailUrl, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const resultJson = await result.json();
  const { success, error } = resultJson;

  if (result.status == 200) {
    return { success, error };
  } else {
    return { success, error };
  }
}

export async function sendOrderInvoiceToCustomer(data) {
  const customerInvoice = "/api/public/sendgrid/send-invoice";

  const result = await fetch(customerInvoice, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const resultJson = await result.json();
  const { success, error } = resultJson;

  if (result.status == 200) {
    return { success, error };
  } else {
    return { success, error };
  }
}

export async function sendDigitalProductLinkToCustomer(data) {
  const customerInvoice = "/api/public/sendgrid/send-digital-products";

  const result = await fetch(customerInvoice, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const resultJson = await result.json();
  const { success, error } = resultJson;

  if (result.status == 200) {
    return { success, error };
  } else {
    return { success, error };
  }
}

export async function sendOrderToBusinessEmail(data) {
  const businessEmailOrderNotif = "/api/public/sendgrid/notifiy-business-order";

  const result = await fetch(businessEmailOrderNotif, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const resultJson = await result.json();
  const { success, error } = resultJson;

  if (result.status == 200) {
    return { success, error };
  } else {
    return { success, error };
  }
}
