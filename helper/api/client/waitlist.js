export async function checkSubdomainAvail(subdomain) {
	const fetchWaitlistUrl = `/api/crud/waitlist/${subdomain}`;

	const waitlistResponse = await fetch(fetchWaitlistUrl, { method: "GET" });
	const responseJSON = await waitlistResponse.json();

	return responseJSON;
}
