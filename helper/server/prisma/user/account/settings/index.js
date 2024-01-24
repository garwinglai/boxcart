import prisma from "@/lib/prisma";

export async function updateUserInfoServer(data) {
  const { shopperAccountId, userData } = data;
  const fullName = userData.firstName + " " + userData.lastName;
  const id = parseInt(shopperAccountId);

  try {
    const updateUser = await prisma.shopperAccount.update({
      where: {
        id,
      },
      data: {
        ...userData,
        name: fullName,
        user: {
          update: {
            ...userData,
            name: fullName,
          },
        },
      },
    });

    return { success: true, value: updateUser };
  } catch (error) {
    console.log("error creating user", error);
    return { success: false, error };
  }
}
