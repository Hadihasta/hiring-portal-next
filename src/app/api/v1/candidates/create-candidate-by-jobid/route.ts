import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
}

//  Definisikan tipe agar lebih aman
interface FieldValue {
  value?: string | number | boolean | null;
}

interface ConfigItem {
  field_key: string;
  label?: string;
  order_index?: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobId, fields, configs } = body as {
      jobId: string | number;
      fields: Record<string, FieldValue>;
      configs: ConfigItem[];
    };

    if (!jobId || !fields || !configs) {
      return NextResponse.json(
        { error: "Missing jobId, fields, or configs" },
        { status: 400 }
      );
    }

    //  nanti ambil dari session user (sementara dummy)
    const userId = 2;

    //. Buat candidate baru
    const newCandidate = await prisma.candidates.create({
      data: {
        job_id: BigInt(jobId),
        user_id: BigInt(userId),
        status: "submitted",
      },
    });

    const candidateId = newCandidate.id;

    // . Pisahkan photo_profile dari fields
    const photoField = fields["photo_profile"];
    const photoUrl = photoField?.value ? String(photoField.value) : null;

    //  Masukkan field lain ke candidate_attributes
    const attributeEntries = Object.entries(fields)
      .filter(([key]) => key !== "photo_profile")
      .map(([key, fieldValue]) => {
        const config = configs.find((c) => c.field_key === key);
        return {
          candidate_id: candidateId,
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

    //  Simpan photo_profile ke tabel photos (jika ada)
    if (photoUrl) {
      await prisma.photos.create({
        data: {
          candidate_id: candidateId,
          photo_url: photoUrl,
          gesture_detected: "Pose 1",
        },
      });
    }

    //  Return hasil akhir
    return NextResponse.json(
      {
        message: "Candidate successfully created",
        data: serializeBigInt({
          candidate: newCandidate,
          attributes: attributeEntries,
          photo: photoUrl,
        }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /create-candidate-by-jobid error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { error: "Internal server error", detail: message },
      { status: 500 }
    );
  }
}
