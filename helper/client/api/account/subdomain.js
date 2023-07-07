export async function checkSubdomainTakenAccount(subdomain) {
  const fetchWaitlistUrl = `/api/public/account/subdomain/${subdomain}`;

  const getUserResponse = await fetch(fetchWaitlistUrl, { method: "GET" });
  const responseJSON = await getUserResponse.json();
  const { success, value, error } = responseJSON;

  if (getUserResponse.status == 200) {
    return { success, value };
  } else {
    return { success, error };
  }
}
