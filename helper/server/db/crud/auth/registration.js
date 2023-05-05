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

	const {
		firstName,
		lastName,
		name,
		email,
		password,
		freePeriodEndDateStr,
		freePeriodEndDateEpoch,
	} = userData;
	const saltRounds = 10;
	const hash = await bcrypt.hash(password, saltRounds);

	console.log(freePeriodEndDateEpoch, freePeriodEndDateStr);

	const {
		accessCode,
		businessName,
		subdomain,
		logoImgStr,
		businessBio,
		fulfillmentMethodInt,
		deliveryTypeInt,
		deliveryTypeStr,
		localDeliveryDistanceStr,
		localDeliveryDistanceKm,
		localDeliveryDistanceMi,
		pickupNote,
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
	try {
		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				name,
				email,
				freePeriodEndDateStr,
				password: hash,
				accounts: {
					create: [
						{
							email,
							name,
							firstName,
							lastName,
							accessCode,
							businessName,
							subdomain,
							logoImgStr,
							businessBio,
							fulfillmentMethodInt,
							deliveryTypeInt,
							deliveryTypeStr,
							localDeliveryDistanceStr,
							localDeliveryDistanceKm,
							localDeliveryDistanceMi,
							pickupNote,
							address_1,
							address_2,
							city,
							state,
							zip,
							fullAddress,
							enableTips,
							typeOfTip,
							businessTypes: {
								create: businessTypeData.map((type) => ({ type })),
							},
							socials: {
								create: [
									{ platform: "facebook", url: facebookUrl },
									{ platform: "instagram", url: instagramUrl },
									{ platform: "youtube", url: youtubeUrl },
									{ platform: "tiktok", url: tiktokUrl },
								],
							},
							fulfillmentMethods: {
								create: fulfillmentData.map((method) => ({ method })),
							},
							tipValues: {
								create: [tip1, tip2, tip3],
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
						tipValues: true,
					},
				},
			},
		});

		console.log("created user success", user);
		return { success: true, user };
	} catch (error) {
		console.log("error creating user", error);
		return { success: false, error };
	}
}
