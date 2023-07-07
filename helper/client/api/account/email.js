export async function checkEmailAvailableWaitlist(email) {
  const purpose = "checkWaitlist";
  const checkEmailUrl = `/api/public/account/email/${email}?purpose=${purpose}`;
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

export async function checkEmailAvailableAccount(email) {
  const purpose = "checkAccount";
  const checkEmailUrl = `/api/public/account/email/${email}?purpose=${purpose}`;
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
