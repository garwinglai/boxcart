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

export async function sendVerificationEmail(userId, accountId, email) {
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
