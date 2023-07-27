export async function updateScheduleEnabledDateClient(updatedSchedulesArr) {
  const apiUrl = `/api/private/availability/schedule/toggle?scheduleType=date`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(updatedSchedulesArr),
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
export async function updateScheduleEnabledRangeClient(updatedSchedulesArr) {
  const apiUrl = `/api/private/availability/schedule/toggle?scheduleType=range`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(updatedSchedulesArr),
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
export async function updateScheduleEnabledWeekClient(updatedSchedulesArr) {
  const apiUrl = `/api/private/availability/schedule/toggle?scheduleType=week`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(updatedSchedulesArr),
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
