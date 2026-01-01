import { NextRequest, NextResponse } from "next/server";

const DOCKO_API_URL = process.env.NEXT_PUBLIC_DOCKO_API_URL || "http://localhost:8000";
const DOCKO_API_KEY = process.env.DOCKO_API_KEY || "";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const endpoint = `/api/v1/management/templates${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(`${DOCKO_API_URL}${endpoint}`, {
      headers: {
        "X-API-Key": DOCKO_API_KEY,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { detail: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetch(`${DOCKO_API_URL}/api/v1/documents/detect-variables`, {
      method: "POST",
      headers: {
        "X-API-Key": DOCKO_API_KEY,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Transform VariableDetectionResponse to Template-like structure
    // Backend returns: { simple: [], sections: [], total_count: N, template_id: "..." }
    // Frontend expects: { id: "...", variables_detected: { simple: [], sections: [] }, ... }
    const template = {
      id: data.template_id,
      name: "", // Will be set by backend, need to fetch full template
      description: "",
      original_filename: "",
      file_size_bytes: 0,
      variables_detected: {
        simple: data.simple || [],
        sections: data.sections || [],
        total_count: data.total_count || 0,
      },
      tags: [],
      category: "general",
      usage_count: 0,
      is_favorite: false,
      created_at: new Date().toISOString(),
      last_used_at: null,
      variable_mappings: null,
      has_mapping: false,
    };

    return NextResponse.json(template, { status: response.status });
  } catch (error) {
    console.error("Error uploading template:", error);
    return NextResponse.json(
      { detail: "Failed to upload template" },
      { status: 500 }
    );
  }
}
