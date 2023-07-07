export async function updateAccountFirstLoginClient(id) {
  const accessCodeUrl = `/api/private/account/updateFirstLogin/`;

  const resCheckCode = await fetch(accessCodeUrl, {
    method: "POST",
    body: JSON.stringify(id),
  });
  const resCheckJSON = await resCheckCode.json();
  const { success, value, error } = resCheckJSON;

  if (resCheckCode.status == 200) {
    return { success, value };
  } else {
    return { success, error };
  }
}

export async function checkIsChecklistCompleteClient(email) {
  const apiUrl = `/api/private/account/checklist?email=${email}`;

  const resAccount = await fetch(apiUrl, {
    method: "GET",
  });

  const accountJSON = await resAccount.json();
  const { status } = resAccount;

  if (status === 200) {
    return { success: true, account: accountJSON };
  } else {
    return { success: false, account: null };
  }
}
