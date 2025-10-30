import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = [
  "https://hijrihadi.space",
  "https://www.hijrihadi.space",
  "https://hiring-portal-next-jrl7.vercel.app",
  "https://hiring-portal-next-jrl7-hadis-projects-30e4620e.vercel.app",
  "http://localhost:3000",
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const isAllowed = allowedOrigins.includes(origin);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": isAllowed ? origin : "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Continue the request and modify response
  const res = NextResponse.next();

  // Tambahkan header CORS di response
  res.headers.set("Access-Control-Allow-Origin", isAllowed ? origin : "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return res;
}

export const config = {
  matcher: ["/:path*"],
};
