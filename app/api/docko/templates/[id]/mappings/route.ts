import { NextRequest, NextResponse } from "next/server";

const DOCKO_API_URL = process.env.NEXT_PUBLIC_DOCKO_API_URL || "http://localhost:8000";
const DOCKO_API_KEY = process.env.DOCKO_API_KEY || "";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const response = await fetch(
      `${DOCKO_API_URL}/api/v1/management/templates/${id}/mappings`,
      {
        method: "PUT",
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
    console.error("Error saving mappings:", error);
    return NextResponse.json(
      { detail: "Failed to save mappings" },
      { status: 500 }
    );
  }
}
