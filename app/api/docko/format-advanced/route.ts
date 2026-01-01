import { NextRequest, NextResponse } from "next/server";

const DOCKO_API_URL = process.env.NEXT_PUBLIC_DOCKO_API_URL || "http://localhost:8000";
const DOCKO_API_KEY = process.env.DOCKO_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    console.log("[format-advanced] Starting background formatting...");

    const response = await fetch(
      `${DOCKO_API_URL}/api/v1/documents/format-advanced-background`,
      {
        method: "POST",
        headers: {
          "X-API-Key": DOCKO_API_KEY,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("[format-advanced] Backend error:", error);
      return NextResponse.json(error, { status: response.status });
    }

    // Returns: { message, file_name, status, session_id }
    const data = await response.json();
    console.log("[format-advanced] Success:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[format-advanced] Error:", error);
    return NextResponse.json(
      { detail: "Failed to start formatting" },
      { status: 500 }
    );
  }
}
