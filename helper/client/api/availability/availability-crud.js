export async function createDatesAvailabilityClient(dates, accountInfoString) {
  const apiUrl = `/api/private/availability/schedule/create/?scheduleType=date&accountInfo=${accountInfoString}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(dates),
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability createDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function createDatesRangedAvailabilityClient(
  dates,
  accountInfoString
) {
  const apiUrl = `/api/private/availability/schedule/create?scheduleType=ranged&accountInfo=${accountInfoString}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(dates),
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability createDatesRangedAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function createDaysOfWeekAvailabilityClient(
  dates,
  accountInfostring
) {
  const apiUrl = `/api/private/availability/schedule/create?scheduleType=weekday&accountInfo=${accountInfostring}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(dates),
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability createDaysOfWeekAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function deleteDatesAvailabilityClient(scheduleId) {
  const apiUrl = `/api/private/availability/schedule/delete?scheduleType=date&scheduleId=${scheduleId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability deleteDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function deleteDatesRangedAvailabilityClient(scheduleId) {
  const apiUrl = `/api/private/availability/schedule/delete?scheduleType=ranged&scheduleId=${scheduleId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability deleteDatesRangedAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function deleteDaysOfWeekAvailabilityClient(scheduleId) {
  const apiUrl = `/api/private/availability/schedule/delete?scheduleType=week&scheduleId=${scheduleId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability deleteDatesRangedAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function getAvailabilitiesClient(availabilityId) {
  const apiUrl = `/api/private/availability?availabilityId=${availabilityId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability getAvailabilities error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateDatesAvailabilityClient(datesData) {
  const apiUrl = `/api/private/availability/schedule/update?scheduleType=date`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(datesData),
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability updateDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateDatesRangedAvailabilityClient(datesData) {
  const apiUrl = `/api/private/availability/schedule/update?scheduleType=range`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(datesData),
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability updateDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateDayOfWeekAvailabilityClient(datesData) {
  const apiUrl = `/api/private/availability/schedule/update?scheduleType=week`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(datesData),
    });

    const data = await response.json();

    return { success: true, value: data };
  } catch (error) {
    console.log(
      "helper/client/api/availability updateDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}
