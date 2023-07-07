// ! Used for waitlist only. Refer to subdomain.js to check subdomain
export async function checkSubdomainAvail(subdomain) {
  const fetchWaitlistUrl = `/api/public/waitlist/${subdomain}`;

  const waitlistResponse = await fetch(fetchWaitlistUrl, { method: "GET" });
  const responseJSON = await waitlistResponse.json();
  const { success, value, error } = responseJSON;

  if (waitlistResponse.status == 200) {
    return { success, value };
  } else {
    return { success, error };
  }
}
