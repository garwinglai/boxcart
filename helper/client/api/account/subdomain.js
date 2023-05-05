export async function checkSubdomainTakenUser(subdomain) {
	const fetchWaitlistUrl = `/api/crud/account/subdomain/${subdomain}`;

	const getUserResponse = await fetch(fetchWaitlistUrl, { method: "GET" });
	const responseJSON = await getUserResponse.json();
	const { success, value, error } = responseJSON;

	console.log("checksubdomain", responseJSON);

	if (getUserResponse.status == 200) {
		return { success, value };
	} else {
		return { success, error };
	}
}
