export async function checkSubdomainAvail(subdomain) {
	console.log("hi")
	const fetchWaitlistUrl = `/api/crud/waitlist/${subdomain}`;

	const waitlistResponse = await fetch(fetchWaitlistUrl, { method: "GET" });
	const responseJSON = await waitlistResponse.json();

	console.log("checksubdomain", responseJSON);

	return responseJSON;
}
