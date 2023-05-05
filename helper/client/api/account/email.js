export async function checkEmailAvailable(email) {
	const checkEmailUrl = `/api/crud/account/email/${email}`;
	const checkEmailResponse = await fetch(checkEmailUrl, {
		method: "GET",
	});
	const responseJSON = await checkEmailResponse.json();
	const { success, value, error } = responseJSON;

	if (checkEmailResponse.status == 200) {
		return { success, value };
	} else {
		return { success, error };
	}
}
