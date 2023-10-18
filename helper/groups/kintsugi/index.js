import prisma from "@/lib/prisma";

export const createBatchProducts = async (builtBatchData, accountId) => {
  try {
    const accounts = await prisma.product.createMany({
      data: {
        ...builtBatchData,
        account: {
          connect: {
            id: accountId,
          },
        },
      },
    });

    return { success: true, value: accounts };
  } catch (error) {
    return { success: false, error };
  }
};

export const getKintSugiRelatedAccounts = async (groupName) => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        referredFrom: groupName,
      },
    });

    const accountData = [];

    for (let i = 0; i < accounts.length; i++) {
      const currAccount = accounts[i];
      const { id, userName, businessName, fullDomain } = currAccount;
      const data = {
        id,
        userName,
        businessName,
        fullDomain,
      };
      accountData.push(data);
    }

    return { success: true, value: accountData };
  } catch (error) {
    return { success: false, error };
  }
};
