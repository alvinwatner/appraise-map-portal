import { NextRequest, NextResponse } from "next/server";

const DOCKO_API_URL = process.env.NEXT_PUBLIC_DOCKO_API_URL || "http://localhost:8000";
const DOCKO_API_KEY = process.env.DOCKO_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Backend expects FormData (multipart/form-data)
    // Required fields: variables (as JSON string)
    // Optional fields: template_id
    const formData = new FormData();

    // Variables is required - must be JSON string
    const variablesJson = JSON.stringify(body.variables || {});
    formData.append("variables", variablesJson);

    // Template ID is optional but we always send it
    if (body.template_id) {
      formData.append("template_id", body.template_id);
    }

    console.log("[generate] Sending to backend:", {
      template_id: body.template_id,
      variables: variablesJson,
    });

    const response = await fetch(`${DOCKO_API_URL}/api/v1/documents/merge-variables`, {
      method: "POST",
      headers: {
        "X-API-Key": DOCKO_API_KEY,
        // Don't set Content-Type - fetch will set it automatically for FormData
      },
      body: formData,
    });

    // Backend returns StreamingResponse with DOCX file, not JSON
    // Document metadata is in response headers
    if (!response.ok) {
      // Error responses are JSON
      const errorData = await response.json();
      console.error("[generate] Backend error:", JSON.stringify(errorData, null, 2));
      return NextResponse.json(errorData, { status: response.status });
    }

    // Extract document info from headers
    const documentId = response.headers.get("X-Document-ID");
    const contentDisposition = response.headers.get("Content-Disposition") || 'attachment; filename="document.docx"';
    const variablesCount = response.headers.get("X-Variables-Count") || "0";

    console.log("[generate] Success:", { documentId, contentDisposition, variablesCount });

    // Return blob with headers (like Docko frontend reference pattern)
    const blob = await response.blob();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": contentDisposition,
        "X-Document-ID": documentId || "",
        "X-Variables-Count": variablesCount,
      },
    });
  } catch (error) {
    console.error("[generate] Error generating document:", error);
    return NextResponse.json(
      { detail: "Failed to generate document" },
      { status: 500 }
    );
  }
}
