import { NextRequest, NextResponse } from "next/server";

const DOCKO_API_URL = process.env.NEXT_PUBLIC_DOCKO_API_URL || "http://localhost:8000";
const DOCKO_API_KEY = process.env.DOCKO_API_KEY || "";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(
      `${DOCKO_API_URL}/api/v1/management/templates/${id}/favorite`,
      {
        method: "POST",
        headers: {
          "X-API-Key": DOCKO_API_KEY,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { detail: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}
