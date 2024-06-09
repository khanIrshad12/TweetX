import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {

    const token = await request.cookies.get("tweetxToken");

    /* if (token !== undefined) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    } */
    // console.log("middlware path",request.nextUrl.pathname );
    if (request.nextUrl.pathname === "/login" && token || request.nextUrl.pathname === "/" && token) {
        // console.log("inside middleware token exist");
        return NextResponse.redirect(new URL("/profile", request.nextUrl));
    } else if ((request.nextUrl.pathname === "/profile" || request.nextUrl.pathname === "/feed" || request.nextUrl.pathname === "/user" ) && token === undefined) {
        // console.log("tokennot exists");
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/",
        "/profile",
        "/feed",
        "/user",
        "/login",
    ],
};
