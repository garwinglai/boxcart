import prisma from "@/lib/prisma";

export default async function assetHandler(req, res) {
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				console.log("api stars");
				const stars = await prisma.star.findMany();
				const user = await prisma.user.findMany();
				console.log(stars);
				res.status(200).json(user);
			} catch (e) {
				console.error("Request error", e);
				res.status(500).json({ error: "Error fetching posts" });
			}

			break;

		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end("Method ${method} Not Allowed");
			break;
	}
}
