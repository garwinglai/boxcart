export async function checkReferralCode(code) {
	const referUrl = `/api/crud/promos/${code}`;

	const resCheckReferral = await fetch(referUrl, {
		method: "GET",
	});
	const resCheckJSON = await resCheckReferral.json();
	const { value } = resCheckJSON;

	if (resCheckReferral.status == 200) {
		return { success: true, value };
	} else {
		return { success: false, value: null };
	}
}

export async function logReferUsed(codeUsed) {
	const referUrl = `/api/crud/promos/${codeUsed}`;

	const resCheckReferral = await fetch(referUrl, {
		method: "POST",
		body: JSON.stringify(codeUsed),
	});
	const resCheckJSON = await resCheckReferral.json();

	return resCheckJSON;
}
