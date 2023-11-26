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

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname.replace(`.boxcart.shop`, "").replace(`.boxcart.vercel.app`, "")
      : hostname.replace(`.localhost:3000`, "");

  if (!url.pathname.includes(".") && !url.pathname.startsWith("/api")) {
    if (currentHost == "app") {
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
}
