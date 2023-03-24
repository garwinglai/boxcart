export async function sendWaitlistConfirmedEmail(finalValues) {
	const resSendgrid = await fetch("/api/email/waitlist-confirmed", {
		method: "POST",
		body: JSON.stringify(finalValues),
	});
}

export async function checkEmailInUse(subdomain, email) {
	const checkEmailUrl = `/api/crud/waitlist/${subdomain}/${email}`;
	const checkEmailResponse = await fetch(checkEmailUrl, {
		method: "GET",
	});
	const responseJSON = await checkEmailResponse.json();

	return responseJSON;
}

export async function sendEmailReferUsed(referrer, referred) {
	const body = {
		referrer,
		referred,
	};

	await fetch("/api/email/referral-used", {
		method: "POST",
		body: JSON.stringify(body),
	});
}
