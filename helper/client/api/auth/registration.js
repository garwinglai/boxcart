export async function newUserSignup(signupValues) {
	const signupUrl = "/api/auth/register";
	console.log("client side", signupValues);

	const response = await fetch(signupUrl, {
		method: "POST",
		body: JSON.stringify(signupValues),
	});
	const responseJson = await response.json();
	const { success, user, error } = responseJson;
	console.log("newUserSignup", responseJson);
	const { status } = response;

	if (status == 200) {
		return { success, user };
	} else {
		return { success, error };
	}
}
