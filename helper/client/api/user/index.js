export async function checkIfUserEmailInUse(email) {
  const apiRoute = `/api/public/user/check-email-in-use?email=${email}`;

  const response = await fetch(apiRoute, {
    method: "GET",
  });
  return await response.json();
}
