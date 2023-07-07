import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function createNewUser(body) {
  const {
    userData,
    accountData,
    businessTypeData,
    fulfillmentData,
    socialsData,
    tipsData,
  } = JSON.parse(body);

  const { firstName, lastName, name, email, password } = userData;
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  const {
    waitlistId,
    accessCode,
    businessName,
    freePeriodEndDateStr,
    freePeriodEndDateEpoch,
    subdomain,
    logoImgStr,
    businessBio,
    fulfillmentMethodInt,
    address_1,
    address_2,
    city,
    state,
    zip,
    fullAddress,
    enableTips,
    typeOfTip,
  } = accountData;

  const { facebookUrl, instagramUrl, tiktokUrl, youtubeUrl } = socialsData;
  const { tip1, tip2, tip3 } = tipsData;
  const revampedTipObject = {
    type: typeOfTip,
    tipOneStr: tip1.tipStr,
    tipOneIntPenny: tip1.tipInt,
    tipTwoStr: tip2.tipStr,
    tipTwoIntPenny: tip2.tipInt,
    tipThreeStr: tip3.tipStr,
    tipThreeIntPenny: tip3.tipInt,
  };
  const freePeriodEndDateEpochStr = freePeriodEndDateEpoch.toString();

  try {
    const { user, updateWaitlist } = await prisma.$transaction(async (pma) => {
      const user = await pma.user.create({
        data: {
          firstName,
          lastName,
          name,
          email,
          password: hash,
          waitlist: {
            connect: {
              id: waitlistId,
            },
          },
          accounts: {
            create: [
              {
                email,
                userName: name,
                firstName,
                lastName,
                freePeriodEndDateStr,
                freePeriodEndDateEpoch: freePeriodEndDateEpochStr,
                accessCode,
                businessName,
                subdomain,
                logoImgStr,
                businessBio,
                fulfillmentMethodInt,
                address_1,
                address_2,
                city,
                state,
                zip,
                fullAddress,
                enableTips,
                checklist: {
                  create: {
                    subdomain,
                  },
                },
                businessTypes: {
                  create: businessTypeData.map((type) => ({
                    type,
                  })),
                },
                socials: {
                  create: [
                    {
                      platform: "facebook",
                      url: facebookUrl,
                    },
                    {
                      platform: "instagram",
                      url: instagramUrl,
                    },
                    {
                      platform: "youtube",
                      url: youtubeUrl,
                    },
                    {
                      platform: "tiktok",
                      url: tiktokUrl,
                    },
                  ],
                },
                fulfillmentMethods: {
                  create: fulfillmentData.map((data) => {
                    const dataToSave = {
                      ...data,
                    };

                    return dataToSave;
                  }),
                },
                tips: {
                  create: revampedTipObject,
                },
                products: {
                  create: [
                    {
                      isSampleProduct: true,
                      productName: "Sample test product",
                      priceIntPenny: 599,
                      priceStr: "$5.99",
                      hasUnlimitedQuantity: false,
                      defaultImgStr:
                        "https://static.gotprint.com/tl/products/generic/images/mugs/11oz_white_mug.jpg",
                      description: "This is a sample product description.",
                      quantity: 28,
                      questions: {
                        create: [
                          {
                            question: "These are sample questions",
                            productName: "Sample test product",
                          },
                          {
                            question: "Do you have any special requests?",
                            productName: "Sample test product",
                          },
                          {
                            question:
                              "Market required for mandatory questions.",
                            productName: "Sample test product",
                          },
                        ],
                      },
                      optionGroups: {
                        create: [
                          {
                            optionGroupName: "Size",
                            productName: "Sample test product",
                            options: {
                              create: [
                                {
                                  optionGroupName: "Size",
                                  optionName: "small",
                                  priceStr: "$0.00",
                                  priceIntPenny: 0,
                                  quantityStr: "5",
                                  quantityInt: 5,
                                },
                                {
                                  optionGroupName: "Size",
                                  optionName: "medium",
                                  priceStr: "$0.75",
                                  priceIntPenny: 75,
                                  quantityStr: "5",
                                  quantityInt: 5,
                                },
                                {
                                  optionGroupName: "Size",
                                  optionName: "large",
                                  priceStr: "$1.00",
                                  priceIntPenny: 100,
                                  quantityStr: "5",
                                  quantityInt: 5,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        include: {
          accounts: {
            include: {
              businessTypes: true,
              socials: true,
              fulfillmentMethods: true,
              tips: true,
              checklist: true,
            },
          },
        },
      });

      const updateWaitlist = await pma.waitlist.update({
        where: {
          earlyBirdCode: accessCode,
        },
        data: {
          email,
          subdomain,
          fName: firstName,
          lName: lastName,
          name,
          isUserCreated: true,
        },
      });

      return { user, updateWaitlist };
    });

    return { success: true, user };
  } catch (error) {
    console.log("error creating user", error);
    return { success: false, error };
  }
}
