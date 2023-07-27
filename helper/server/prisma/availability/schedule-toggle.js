import prisma from "@/lib/prisma";

export async function updateEnableDateScheduleServer(updatedSchedulesArr) {
  try {
    // update the isEnabled field for each schedule in the updatedSchedulesArr
    const updatedSchedules = await Promise.all(
      updatedSchedulesArr.map(async (schedule) => {
        const { isEnabled, scheduleId } = schedule;
        const scheduleIdInt = parseInt(scheduleId);

        const updatedSchedule = await prisma.datesAvailability.update({
          where: {
            id: scheduleIdInt,
          },
          data: {
            isEnabled: isEnabled,
          },
        });

        return updatedSchedule;
      })
    );

    return { success: true, value: updatedSchedules };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability updateEnableDateScheduleServer error:",
      error
    );

    return { success: false, error };
  }
}
export async function updateEnableRangeScheduleServer(updatedSchedulesArr) {
  try {
    const updatedSchedules = await Promise.all(
      updatedSchedulesArr.map(async (schedule) => {
        const { isEnabled, scheduleId } = schedule;
        const scheduleIdInt = parseInt(scheduleId);

        const updatedSchedule = await prisma.datesRangedAvailability.update({
          where: {
            id: scheduleIdInt,
          },
          data: {
            isEnabled: isEnabled,
          },
        });

        return updatedSchedule;
      })
    );

    return { success: true, value: updatedSchedules };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability updateEnableRangeScheduleServer error:",
      error
    );

    return { success: false, error };
  }
}

export async function updateEnableWeekScheduleServer(updatedSchedulesArr) {
  try {
    const updatedSchedules = await Promise.all(
      updatedSchedulesArr.map(async (schedule) => {
        const { isEnabled, scheduleId } = schedule;
        const scheduleIdInt = parseInt(scheduleId);

        const updatedSchedule = await prisma.daysOfWeekAvailability.update({
          where: {
            id: scheduleIdInt,
          },
          data: {
            isEnabled: isEnabled,
          },
        });

        return updatedSchedule;
      })
    );

    return { success: true, value: updatedSchedules };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability updateEnableWeekScheduleServer error:",
      error
    );

    return { success: false, error };
  }
}
