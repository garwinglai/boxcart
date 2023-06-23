import React, { useState } from "react";
import ButtonLoader from "@/components/common/loaders/ButtonLoader";
import PageLoader from "@/components/common/loaders/PageLoader";
// import { Prisma } from "@prisma/client";
// import prisma from "@/lib/prisma";

function Test({}) {
	// console.log("user client", user);

	// const dateInEpoch = Date.parse(user.freePeriodEndDateStr);
	// // console.log("epoch", dateInEpoch);
	// console.log("date", user.freePeriodEndDateStr);
	// console.log("date", new Date(dateInEpoch));

	return (
		<div>
			<PageLoader />

			<h1>Display Data</h1>
			{/* <p>{JSON.stringify(user)}</p>
			<p>{dateInEpoch}</p> */}
		</div>
	);
}

export default Test;

// export async function getServerSideProps(context) {
// 	const user = await prisma.user.findFirst({
// 		where: { id: 1 },
// 	});
// 	console.log("createdAt", user.createdAt);

// 	user.createdAt = user.createdAt.toString();
// 	user.updatedAt = user.updatedAt.toString();

// 	console.log("user", user);

// 	return {
// 		props: { user }, // will be passed to the page component as props
// 	};
// }
