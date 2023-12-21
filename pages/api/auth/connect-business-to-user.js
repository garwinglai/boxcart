import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    const { newUserData, id } = body;
    console.log("newUserData", newUserData);
    const userId = parseInt(id);
    const {
      userData,
      accountData,
      businessTypeData,
      fulfillmentData,
      socialsData,
    } = newUserData;

    const { firstName, lastName, name, email } = userData;
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
      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          accounts: {
            connectOrCreate: {
              where: {
                email,
              },
              create: {
                email,
                userName: name,
                firstName,
                lastName,
                freePeriodEndDateStr,
                freePeriodEndDateEpoch: freePeriodEndDateEpochStr,
                // accessCode,
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
                    isDeliverySet: fulfillmentData.some(
                      (data) => data.methodInt === 1
                    ),
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
                                  quantity: 5,
                                },
                                {
                                  optionGroupName: "Size",
                                  optionName: "medium",
                                  priceStr: "$0.75",
                                  priceIntPenny: 75,
                                  quantity: 5,
                                },
                                {
                                  optionGroupName: "Size",
                                  optionName: "large",
                                  priceStr: "$1.00",
                                  priceIntPenny: 100,
                                  quantity: 5,
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
            },
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

      res.status(200).json({ success: true, user });
    } catch (error) {
      console.log("error", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = {
          code: error.code,
          message: error.message,
          target: error.meta,
        };

        console.log("prismaError", prismaError.code);

        res.status(500).json({ success: false, error: prismaError.code });
        return;
      }
      console.log("error", error);

      res.status(500).json({ success: false, error: "error" });
    }
  }
}
