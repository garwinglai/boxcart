export async function updateHasScheduleAccountClient(
  isCustomHoursEnabled,
  accountId
) {
  const apiUrl = `/api/private/availability/toggle?accountId=${accountId}&toggle=availability`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(isCustomHoursEnabled),
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability updateHasScheduleAccount error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateTimeBlockToggleAccountClient(
  isTimeBlockEnabled,
  accountId
) {
  const apiUrl = `/api/private/availability/toggle?accountId=${accountId}&toggle=timeBlock`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(isTimeBlockEnabled),
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability updateTimeBlockToggleAccount error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateOrderInAdvanceToggleAccountClient(
  orderInAdvanceEnabled,
  accountId
) {
  const apiUrl = `/api/private/availability/toggle?accountId=${accountId}&toggle=orderInAdvance`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(orderInAdvanceEnabled),
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability updateTimeBlockToggleAccount error:",
      error
    );

    return { success: false, error };
  }
}
