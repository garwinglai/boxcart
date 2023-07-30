import prisma from "@/lib/prisma";

export async function updateHasScheduleAccountServer(
  enableSchedule,
  accountId
) {
  const accountIdInt = parseInt(accountId);

  try {
    const account = await prisma.account.update({
      where: {
        id: accountIdInt,
      },
      data: {
        hasCustomAvailability: enableSchedule,
      },
    });

    return { success: true, value: account };
  } catch (error) {
    console.log(
      "helper/server/prisma/availability updateHasScheduleAccount error:",
      error
    );

    return { success: false, error };
  }
}