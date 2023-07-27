export async function updateHasScheduleAccountClient(
  isCustomHoursEnabled,
  accountId
) {
  const isEnabled = isCustomHoursEnabled;

  const apiUrl = `/api/private/availability/toggle?accountId=${accountId}`;

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
