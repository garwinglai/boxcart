import { options } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

// Used in API routes...
export async function isAuthServer(req, res) {
	const session = await getServerSession(req, res, options);

	if (!session) return false;
	return true;
}
