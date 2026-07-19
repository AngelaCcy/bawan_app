import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Issues client-upload tokens so the import wizard can push extracted
// product images from the browser straight to Vercel Blob (image bytes
// never pass through a serverless function).
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  // Generous limit: one bulk import uploads several hundred small images
  const { ok } = checkRateLimit(`product-image-token:${ip}`, 1000, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = (await req.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
        if (!pathname.startsWith("products/")) {
          throw new Error("Invalid upload path");
        }
        return {
          // Keep in sync with IMAGE_MIME in lib/xlsx-import.ts
          allowedContentTypes: [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp",
            "image/bmp",
          ],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      // Not called in local dev (Blob can't reach localhost); the wizard
      // stores the returned URL itself, so no DB work is needed here.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
