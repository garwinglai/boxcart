// ! Used for waitlist only. Refer to subdomain.js to check subdomain
export async function checkSubdomainAvail(subdomain) {
	console.log("hi", subdomain);
	const fetchWaitlistUrl = `/api/crud/waitlist/${subdomain}`;

	const waitlistResponse = await fetch(fetchWaitlistUrl, { method: "GET" });
	const responseJSON = await waitlistResponse.json();
	const { success, value, error } = responseJSON;

	console.log("checksubdomain", responseJSON);

	if (waitlistResponse.status == 200) {
		return { success, value };
	} else {
		return { success, error };
	}
}
