// src/app/api/v1/candidates/add-details/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Helper untuk konversi BigInt ke Number agar bisa dikirim sebagai JSON
function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
}

interface FieldValue {
  value?: string | number | boolean | null;
}

interface ConfigItem {
  field_key: string;
  label?: string;
  order_index?: number;
}

/**
 * Endpoint: POST /api/v1/candidates/add-details
 * Body: { candidateId, fields, configs }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, fields, configs } = body as {
      candidateId: string | number;
      fields: Record<string, FieldValue>;
      configs: ConfigItem[];
    };

    if (!candidateId || !fields || !configs) {
      return NextResponse.json(
        { error: "Missing candidateId, fields, or configs" },
        { status: 400 }
      );
    }

    // ✅ Pastikan candidate ada
    const candidate = await prisma.candidates.findUnique({
      where: { id: BigInt(candidateId) },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // ✅ Pisahkan photo_profile
    const photoField = fields["photo_profile"];
    const photoUrl = photoField?.value ? String(photoField.value) : null;

    // ✅ Buat daftar attribute yang akan dimasukkan
    const attributeEntries = Object.entries(fields)
      .filter(([key]) => key !== "photo_profile")
      .map(([key, fieldValue]) => {
        const config = configs.find((c) => c.field_key === key);
        return {
          candidate_id: BigInt(candidateId),
          key,
          label: config?.label ?? key,
          value: String(fieldValue?.value ?? ""),
          order_index: config?.order_index ?? 0,
        };
      });

    if (attributeEntries.length > 0) {
      await prisma.candidate_attributes.createMany({
        data: attributeEntries,
      });
    }

    // ✅ Simpan foto (jika ada)
    if (photoUrl) {
      await prisma.photos.create({
        data: {
          candidate_id: BigInt(candidateId),
          photo_url: photoUrl,
          gesture_detected: "Pose 1",
        },
      });
    }

    // ✅ Ambil kembali data lengkap candidate
    const fullCandidate = await prisma.candidates.findUnique({
      where: { id: BigInt(candidateId) },
      include: {
        attributes: true,
        photos: true,
      },
    });

    return NextResponse.json(
      {
        message: "Candidate details added successfully",
        data: serializeBigInt(fullCandidate),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /add-details error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { error: "Internal server error", detail: message },
      { status: 500 }
    );
  }
}
