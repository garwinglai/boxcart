export async function updateProductVerifiedChecklist(accountId) {
  // Account Id is unique in checklist schema.
  const apiRoute = `/api/private/account/checklist?accountId=${accountId}&updateKey=productVerified`;

  try {
    const res = await fetch(apiRoute, {
      method: "POST",
    });
    const data = await res.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/checklist updateProductVerified error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateFulfillmentChecklistClient(accountId) {
  // Account Id is unique in checklist schema.
  const apiRoute = `/api/private/account/checklist?accountId=${accountId}&updateKey=fulfillmentVerified`;

  try {
    const res = await fetch(apiRoute, {
      method: "POST",
    });
    const data = await res.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/checklist updateProductVerified error:",
      error
    );

    return { success: false, error };
  }
}

export async function updatePaymentChecklistClient(accountId) {
  // Account Id is unique in checklist schema.
  const apiRoute = `/api/private/account/checklist?accountId=${accountId}&updateKey=paymentVerified`;

  try {
    const res = await fetch(apiRoute, {
      method: "POST",
    });
    const data = await res.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/checklist updateProductVerified error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateAvailabilityChecklistClient(accountId, isAvailSet) {
  // Account Id is unique in checklist schema.
  const apiRoute = `/api/private/account/checklist?accountId=${accountId}&updateKey=availabilityVerified&updateValue=${isAvailSet}`;

  try {
    const res = await fetch(apiRoute, {
      method: "POST",
    });
    const data = await res.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/checklist updateProductVerified error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateViewStoreChecklistClient(accountId) {
  // Account Id is unique in checklist schema.
  const apiRoute = `/api/private/account/checklist?accountId=${accountId}&updateKey=viewStoreVerified`;

  try {
    const res = await fetch(apiRoute, {
      method: "POST",
    });
    const data = await res.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/checklist updateProductVerified error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateIsChecklistComplete(
  accountId,
  isChecklistComplete
) {
  const data = {
    accountId,
    isChecklistComplete,
  };

  const api = "/api/private/account/checklist/updateIsChecklistComplete";
  const res = fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateIsNonMandatoryChecklistComplete(
  accountId,
  isChecklistComplete
) {
  const data = {
    accountId,
    isChecklistComplete,
  };

  const api =
    "/api/private/account/checklist/updateIsNonMandatoryChecklistComplete";
  const res = fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
