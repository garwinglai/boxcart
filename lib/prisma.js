// import { PrismaClient } from "@prisma/client";

// let prisma;

// if (process.env.NODE_ENV === "production") {
// 	prisma = new PrismaClient();
// } else {
// 	if (!global.prisma) {
// 		global.prisma = new PrismaClient();
// 	}

// 	prisma = global.prisma;
// }

// export default prisma;

import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient({
		log: ["info", "warn"],
		errorFormat: "minimal",
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
				provider: "mysql",
				connection: {
					ssl: {
						rejectUnauthorized: false,
					},
				},
			},
		},
	});
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

export default prisma;
