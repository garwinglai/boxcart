export async function checkAccessCode(code) {
  const accessCodeUrl = `/api/public/codes/access-code/${code}`;

  const resCheckCode = await fetch(accessCodeUrl, {
    method: "GET",
  });
  const resCheckJSON = await resCheckCode.json();
  const { success, value, error } = resCheckJSON;

  if (resCheckCode.status == 200) {
    return { success, value };
  } else {
    return { success, error };
  }
}
