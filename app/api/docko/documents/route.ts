import { NextRequest, NextResponse } from "next/server";

const DOCKO_API_URL = process.env.NEXT_PUBLIC_DOCKO_API_URL || "http://localhost:8000";
const DOCKO_API_KEY = process.env.DOCKO_API_KEY || "";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const endpoint = `/api/v1/management/documents${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(`${DOCKO_API_URL}${endpoint}`, {
      headers: {
        "X-API-Key": DOCKO_API_KEY,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { detail: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
