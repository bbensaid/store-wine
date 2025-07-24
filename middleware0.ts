import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/products(.*)", // all /products and subroutes
  "/about",
  "/sign-in",
  "/sign-up", // if you have a sign-up page
  "/",
]);

export default clerkMiddleware(async (auth, req) => {
  console.log("middleware running", req.nextUrl.pathname);
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(
        `https://super-stag-57.accounts.dev/sign-in?redirect_url=${encodeURIComponent(
          req.url
        )}`
      );
    }
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
