export async function updatePaymentClient(data) {
  const apiUrl = "/api/private/payments";

  const res = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const resJson = await res.json();

  if (res.status === 200) {
    return { success: true, value: resJson };
  } else {
    return { success: false, value: null };
  }
}
