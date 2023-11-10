export const saveContact = async (contactData) => {
  const { fName, lName, email, accountId } = contactData;
  const apiUrl = "/api/public/storefront/save-contact";

  const payload = {
    contact: {
      fName,
      lName,
      email,
    },
    accountId,
  };

  const contact = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const { errorCode } = await contact.json();

  if (errorCode === "P2002") {
    // Contact already added, don't need to handle error
  }
};
