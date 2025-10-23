// src/app/api/v1/candidates/get-by-user-and-job/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Convert BigInt → Number agar bisa di-return lewat JSON
 */
function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
}

/**
 * Endpoint: POST /api/v1/candidates/get-by-user-and-job
 * Body: { userId: number | string, jobId: number | string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, jobId } = body as {
      userId?: number | string;
      jobId?: number | string;
    };

    if (!userId || !jobId) {
      return NextResponse.json(
        { error: "Missing userId or jobId in request body" },
        { status: 400 }
      );
    }

    // ✅ Cari candidate berdasarkan user_id dan job_id
    const candidate = await prisma.candidates.findFirst({
      where: {
        user_id: BigInt(userId),
        job_id: BigInt(jobId),
      },
      include: {
        attributes: true,
        photos: true,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { message: "No candidate found for this user and job" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Candidate retrieved successfully",
        data: serializeBigInt(candidate),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /get-by-user-and-job error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { error: "Internal server error", detail: message },
      { status: 500 }
    );
  }
}
