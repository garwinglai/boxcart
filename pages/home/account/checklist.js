import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { isAuth } from "@/helper/client/api/auth/isAuth";

function CheckList({ session }) {
	return (
		<div>
			<h1>checklist</h1>
			<button onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
				Sign Out
			</button>
		</div>
	);
}

export default CheckList;

export async function getServerSideProps(context) {
	return isAuth(context, (session) => {
		return {
			props: {
				session,
			},
		};
	});
}
