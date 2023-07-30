import prisma from "@/lib/prisma";

export async function createDatesAvailabilityServer(dates, accountInfoString) {
  const { accountId, availabitiy } = JSON.parse(accountInfoString);
  const accountIdInt = parseInt(accountId);

  try {
    const res = await prisma.datesAvailability.create({
      data: {
        ...dates,
        availability: {
          connectOrCreate: {
            where: {
              accountId: accountIdInt,
            },
            create: {
              account: !availabitiy && {
                connect: {
                  id: accountIdInt,
                },
              },
            },
          },
        },
      },
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability createDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function createDatesRangedAvailabilityServer(
  dates,
  accountInfoString
) {
  const { accountId, availabitiy } = JSON.parse(accountInfoString);
  const accountIdInt = parseInt(accountId);

  try {
    const res = await prisma.datesRangedAvailability.create({
      data: {
        ...dates,
        availability: {
          connectOrCreate: {
            where: {
              accountId: accountIdInt,
            },
            create: {
              account: !availabitiy && {
                connect: {
                  id: accountIdInt,
                },
              },
            },
          },
        },
      },
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability createDatesRangedAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function createDaysOfWeekAvailabilityServer(
  dates,
  accountInfoString
) {
  const { accountId, availabitiy } = JSON.parse(accountInfoString);
  const accountIdInt = parseInt(accountId);

  try {
    const res = await prisma.daysOfWeekAvailability.create({
      data: {
        ...dates,
        availability: {
          connectOrCreate: {
            where: {
              accountId: accountIdInt,
            },
            create: {
              account: !availabitiy && {
                connect: {
                  id: accountIdInt,
                },
              },
            },
          },
        },
      },
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability createDaysOfWeekAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function deleteDatesAvailabilityServer(scheduleId) {
  const scheduleIdInt = parseInt(scheduleId);

  try {
    const res = await prisma.datesAvailability.delete({
      where: {
        id: scheduleIdInt,
      },
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability deleteDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function deleteDatesRangedAvailabilityServer(scheduleId) {
  const scheduleIdInt = parseInt(scheduleId);

  try {
    const res = await prisma.datesRangedAvailability.delete({
      where: {
        id: scheduleIdInt,
      },
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability deleteDatesRangedAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function deleteDayOfWeekAvailabilityServer(scheduleId) {
  const scheduleIdInt = parseInt(scheduleId);

  try {
    const res = await prisma.daysOfWeekAvailability.delete({
      where: {
        id: scheduleIdInt,
      },
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability deleteDatesRangedAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function getAvailabilitiesServer(availabilityId) {
  const availabilityIdInt = parseInt(availabilityId);

  try {
    const res = await prisma.availability.findUnique({
      where: {
        id: availabilityIdInt,
      },
      include: {
        datesAvailability: true,
        datesRangedAvailability: true,
        daysOfWeekAvailability: true,
      },
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability getAvailabilities error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateDatesAvailabilityServer(datesData) {
  const { id } = datesData;
  const scheduleIdInt = parseInt(id);
  const copyData = { ...datesData };
  delete copyData.id;

  try {
    const res = await prisma.datesAvailability.update({
      where: {
        id: scheduleIdInt,
      },
      data: copyData,
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability updateDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateDatesRangeAvailabilityServer(datesData) {
  const { id } = datesData;
  const scheduleIdInt = parseInt(id);
  const copyData = { ...datesData };
  delete copyData.id;

  try {
    const res = await prisma.datesRangedAvailability.update({
      where: {
        id: scheduleIdInt,
      },
      data: copyData,
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability updateDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateDayOfWeekAvailabilityServer(datesData) {
  const { id } = datesData;
  const scheduleIdInt = parseInt(id);
  const copyData = { ...datesData };
  delete copyData.id;

  try {
    const res = await prisma.daysOfWeekAvailability.update({
      where: {
        id: scheduleIdInt,
      },
      data: copyData,
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability updateDatesAvailability error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateTimeBlockServer(timeBlockData, accountId) {
  const accountIdInt = parseInt(accountId);

  try {
    const res = await prisma.account.update({
      where: {
        id: accountIdInt,
      },
      data: timeBlockData,
    });

    return { success: true, value: res };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability updateTimeBlock error:",
      error
    );

    return { success: false, error };
  }
}
