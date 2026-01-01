import { NextRequest, NextResponse } from "next/server";

const DOCKO_API_URL = process.env.NEXT_PUBLIC_DOCKO_API_URL || "http://localhost:8000";
const DOCKO_API_KEY = process.env.DOCKO_API_KEY || "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${DOCKO_API_URL}/api/v1/management/templates/${id}`, {
      headers: {
        "X-API-Key": DOCKO_API_KEY,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { detail: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${DOCKO_API_URL}/api/v1/management/templates/${id}`, {
      method: "DELETE",
      headers: {
        "X-API-Key": DOCKO_API_KEY,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { detail: "Failed to delete template" },
      { status: 500 }
    );
  }
}
