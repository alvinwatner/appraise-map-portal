import { NextRequest, NextResponse } from "next/server";

const DOCKO_API_URL = process.env.NEXT_PUBLIC_DOCKO_API_URL || "http://localhost:8000";
const DOCKO_API_KEY = process.env.DOCKO_API_KEY || "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("[document-download] Downloading document:", id);

    const response = await fetch(
      `${DOCKO_API_URL}/api/v1/documents/${id}/download`,
      {
        headers: {
          "X-API-Key": DOCKO_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("[document-download] Backend error:", error);
      return NextResponse.json(error, { status: response.status });
    }

    // Return blob for download
    const blob = await response.blob();
    console.log("[document-download] Success, blob size:", blob.size);

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": response.headers.get("Content-Disposition") || 'attachment; filename="document.docx"',
      },
    });
  } catch (error) {
    console.error("[document-download] Error:", error);
    return NextResponse.json(
      { detail: "Failed to download document" },
      { status: 500 }
    );
  }
}
