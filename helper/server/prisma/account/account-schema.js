import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function updateAccountFirstLoginServer(body) {
  const id = JSON.parse(body);

  try {
    const updateUser = await prisma.account.update({
      where: {
        id,
      },
      data: {
        isFirstLogin: false,
      },
    });

    return { success: true, value: updateUser };
  } catch (error) {
    console.log("error creating user", error);
    return { success: false, error };
  }
}

export async function checkIsChecklistCompleteServer(email) {
  try {
    const account = await prisma.account.findUnique({
      where: {
        email,
      },
      include: {
        checklist: true,
      },
    });

    return { success: true, value: account };
  } catch (error) {
    console.log("error creating user", error);
    return { success: false, error };
  }
}

export async function updateAccountSettingsServer(body) {
  const { accountId, updatedSettings, socialLinks, removedSocialLinks } =
    JSON.parse(body);

  try {
    const updateUser = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        ...updatedSettings,
        checklist: {
          update: {
            hasLogo: updatedSettings.logoImage ? true : false,
            hasBanner: updatedSettings.bannerImage ? true : false,
            subdomain: updatedSettings.subdomain,
          },
        },
        socials: {
          upsert: socialLinks.filter((social) => {
            const { platform, socialLink, id } = social;

            if (id) return;

            return {
              where: {
                social_identifier: {
                  accountId,
                  socialLink,
                },
              },
              update: social,
              create: social,
            };
          }),
          deleteMany: removedSocialLinks.map((item) => {
            const { id, socialLink } = item;
            return {
              id,
            };
          }),
        },
      },
      include: {
        socials: true,
      },
    });

    return { success: true, value: updateUser };
  } catch (error) {
    console.log("error creating user", error);
    return { success: false, error };
  }
}
