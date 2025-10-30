import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = [
  "https://hijrihadi.space",
  "https://www.hijrihadi.space",
  "https://hiring-portal-next-jrl7.vercel.app",
  "https://hiring-portal-next-jrl7-hadis-projects-30e4620e.vercel.app",
  "http://localhost:3000"
];

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  const isAllowed = origin && allowedOrigins.includes(origin);

  if (req.nextUrl.pathname.startsWith("/api")) {
    const res = NextResponse.next();

    res.headers.set("Access-Control-Allow-Origin", isAllowed ? origin! : "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: res.headers,
      });
    }

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
