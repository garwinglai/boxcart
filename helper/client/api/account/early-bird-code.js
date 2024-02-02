export async function checkAccessCode(code) {
  const accessCodeUrl = `/api/public/waitlist/early-code/${code}`;

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

export async function checkAccessCodeUsed(code) {
  const accessCodeUrl = `/api/public/account/early-code-used/${code}`;

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
