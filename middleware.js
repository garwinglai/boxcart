import { NextResponse } from "next/server";

export const config = {
	matcher: [
		/*
		 * Match all paths except for:
		 * 1. /api routes
		 * 2. /_next (Next.js internals)
		 * 3. /examples (inside /public)
		 * 4. all root files inside /public (e.g. /favicon.ico)
		 */
		"/((?!api/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)",
	],
};

export function middleware(req) {
	const url = req.nextUrl.clone();
	const { pathname } = req.nextUrl;
	const hostname = req.headers.get("host");

	// const url = req.nextUrl;
	// console.log("middleware url:", url);
	// console.log("middleware req.url:", req.url);

	// Get hostname of request (e.g. example.boxcart.shop, example.localhost:3000)
	// const hostname = req.headers.get("host") || "test.boxcart.shop";
	// console.log(req.headers.get("host"));
	// console.log("middleware hostname:", hostname);

	// Get the pathname of the request (e.g. /, /about, /blog/first-post)
	// const path = url.pathname;
	// console.log("middleware pathname:", pathname);

	// Only for demo purposes - remove this if you want to use your root domain as the landing page
	// if (
	// 	hostname === "boxcart.shop" ||
	// 	hostname === "boxcart.vercel.app" ||
	// 	hostname === "localhost:3000"
	// ) {
	// 	console.log("pathname", pathname);
	// 	if (pathname === "/") return NextResponse.redirect("https://boxcart.shop");
	// }

	/*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */

	const currentHost =
		process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
			? hostname.replace(`.boxcart.shop`, "").replace(`.boxcart.vercel.app`, "")
			: hostname.replace(`.localhost:3000`, "");

	// console.log("middleware currentHost", currentHost);

	if (!url.pathname.includes(".") && !url.pathname.startsWith("/api")) {
		if (currentHost == "app") {
			// if (
			//   url.pathname === "/login" &&
			//   (req.cookies.get("next-auth.session-token") ||
			//     req.cookies.get("__Secure-next-auth.session-token"))
			// ) {
			//   url.pathname = "/";
			//   return NextResponse.redirect(url);
			// }

			url.pathname = `/app${url.pathname}`;
			return NextResponse.rewrite(url);
		}

		if (
			hostname === "localhost:3000" ||
			hostname === "boxcart.vercel.app" ||
			hostname === "boxcart.shop" ||
			hostname === "www.boxcart.shop"
		) {
			// console.log("rewrite to home/");
			url.pathname = `/home${url.pathname}`;
			return NextResponse.rewrite(url);
		}

		// console.log("rewrite to _site");
		url.pathname = `/_sites/${currentHost}${url.pathname}`;
		return NextResponse.rewrite(url);
	}

	// // rewrites for app pages
	// if (currentHost == "app") {
	// 	console.log("inside app folder");
	// 	// if (
	// 	// 	url.pathname === "/login" &&
	// 	// 	(req.cookies.get("next-auth.session-token") ||
	// 	// 		req.cookies.get("__Secure-next-auth.session-token"))
	// 	// ) {
	// 	// 	url.pathname = "/";
	// 	// 	return NextResponse.redirect(url);
	// 	// }

	// 	url.pathname = `/app${url.pathname}`;
	// 	return NextResponse.rewrite(url);
	// }

	// // rewrite root application to `/home` folder
	// if (
	// 	hostname === "localhost:3000" ||
	// 	hostname === "boxcart.shop" ||
	// 	hostname === "boxcart.vercel.app"
	// ) {
	// 	console.log("inside home folder");
	// 	return NextResponse.rewrite(new URL(`/home${path}`, req.url));
	// }

	// // rewrite everything else to `/_sites/[site] dynamic route
	// return NextResponse.rewrite(
	// 	new URL(`/_sites/${currentHost}${path}`, req.url)
	// );
}
