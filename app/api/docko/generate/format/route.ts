import { NextRequest, NextResponse } from "next/server";

const DOCKO_API_URL = process.env.NEXT_PUBLIC_DOCKO_API_URL || "http://localhost:8000";
const DOCKO_API_KEY = process.env.DOCKO_API_KEY || "";

// Generate document with auto-formatting (background processing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${DOCKO_API_URL}/api/v1/documents/format-advanced-background`,
      {
        method: "POST",
        headers: {
          "X-API-Key": DOCKO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error generating formatted document:", error);
    return NextResponse.json(
      { detail: "Failed to generate formatted document" },
      { status: 500 }
    );
  }
}
