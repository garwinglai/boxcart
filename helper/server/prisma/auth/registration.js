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
  } = JSON.parse(body);

  const { firstName, lastName, name, email, password } = userData;
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  const {
    // waitlistId,
    accessCode,
    businessName,
    freePeriodEndDateStr,
    freePeriodEndDateEpoch,
    subdomain,
    fullDomain,
    logoImageFileName,
    logoImage,
    businessBio,
    fulfillmentMethodInt,
    lat,
    lng,
    geohash,
    address_1,
    address_2,
    city,
    state,
    zip,
    fullAddress,
    typeOfTip,
  } = accountData;

  const freePeriodEndDateEpochStr = freePeriodEndDateEpoch.toString();

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        name,
        email,
        password: hash,
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
              fullDomain,
              logoImageFileName,
              logoImage,
              businessBio,
              fulfillmentMethodInt,
              lat,
              lng,
              geohash,
              address_1,
              address_2,
              city,
              state,
              zip,
              fullAddress,
              checklist: {
                create: {
                  requireAvailability: fulfillmentData.some(
                    (data) => data.method === "pickup"
                  ),
                  hasLogo: logoImage ? true : false,
                  subdomain,
                },
              },
              businessTypes: {
                create: businessTypeData.map((type) => ({
                  type,
                })),
              },
              socials: {
                create: socialsData.map((data) => {
                  return data;
                }),
              },
              fulfillmentMethods: {
                create: fulfillmentData.map((data) => {
                  const dataToSave = {
                    ...data,
                  };

                  return dataToSave;
                }),
              },

              tax: {
                create: {},
              },
              availability: {
                create: {},
              },
              products: {
                create: [
                  {
                    isSampleProduct: true,
                    productName: "Sample test product",
                    priceIntPenny: 599,
                    priceStr: "$5.99",
                    hasUnlimitedQuantity: false,
                    defaultImage:
                      "https://static.gotprint.com/tl/products/generic/images/mugs/11oz_white_mug.jpg",
                    defaultImageFileName: "",
                    description: "This is a sample product description.",
                    quantity: 28,
                    questions: {
                      create: [
                        {
                          question: "These are sample questions",
                          productName: "Sample product",
                        },
                        {
                          question: "Do you have any special requests?",
                          productName: "Sample product",
                        },
                        {
                          question: "Is question required?",
                          productName: "Sample product",
                        },
                      ],
                    },
                    optionGroups: {
                      create: [
                        {
                          optionGroupName: "Size",
                          productName: "Sample product",
                          selectionType: 0,
                          selectionDisplay: "select one",
                          isRequired: true,
                          isRequiredDisplay: "required",
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
            checklist: true,
          },
        },
      },
    });

    return { success: true, user };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = {
        code: error.code,
        message: error.message,
        target: error.meta,
      };

      console.log(
        "error fetching email prismaError helper/server/db/account/email:",
        prismaError
      );
    }
    console.log("error creating user", error);
    return { success: false, error };
  }
}
