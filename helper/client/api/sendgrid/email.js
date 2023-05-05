export async function sendWaitlistConfirmedEmail(finalValues) {
	const resSendgrid = await fetch("/api/sendgrid/waitlist-confirmed", {
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

export async function sendVerificationEmail(id, email) {
	const verificationEmailUrl = "/api/sendgrid/verify-email";
	const data = {
		id,
		email,
	};

	const result = await fetch(verificationEmailUrl, {
		method: "POST",
		body: JSON.stringify(data),
	});

	const resultJon = result.json();
	const { success, error } = resultJon;

	if (result.status == 200) {
		return { success, error };
	} else {
		return { success, error };
	}
}
