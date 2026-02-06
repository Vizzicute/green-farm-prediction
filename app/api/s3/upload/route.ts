import { env } from "@/schema/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3/client";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Filename Required" }),
  contentType: z.string().min(1, { message: "Content Type Required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, // 6 mins
    });

    const res = {
      presignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate presigned Url" },
      { status: 500 }
    );
  }
}
