/**
 * Docko API Service
 *
 * Client for interacting with Docko document automation backend.
 * Requests are proxied through Next.js API routes for security.
 * API key authentication is handled server-side.
 */

// Types
export interface VariableDetection {
  simple: string[];
  sections: string[];
  total_count: number;
}

export interface VariableMapping {
  type: "property" | "manual" | "static";
  field?: string;
  label?: string;
  value?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  original_filename: string;
  file_size_bytes: number;
  variables_detected: VariableDetection;
  tags: string[];
  category: string;
  usage_count: number;
  is_favorite: boolean;
  created_at: string;
  last_used_at: string | null;
  variable_mappings?: Record<string, VariableMapping>;
  has_mapping?: boolean;
}

export interface GeneratedDocument {
  id: string;
  template_id: string | null;
  name: string;
  generated_filename: string;
  export_format: string;
  file_size_bytes: number;
  status: "completed" | "processing" | "failed";
  download_count: number;
  tags: string[];
  is_favorite: boolean;
  notes: string;
  created_at: string;
  last_downloaded_at: string | null;
}

export interface DownloadUrlResponse {
  download_url: string;
  expires_in: number;
  filename: string;
}

export interface GenerationSettings {
  auto_formatting: boolean;
  export_format: "docx" | "pdf";
}

// API Client - uses internal Next.js API routes for security
class DockoService {
  private baseUrl: string = "/api/docko";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      ...options.headers,
    };

    // Don't set Content-Type for FormData (browser will set it with boundary)
    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // Template Management
  async listTemplates(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<Template[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.set("skip", params.skip.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.category) searchParams.set("category", params.category);

    const queryString = searchParams.toString();
    const endpoint = `/templates${queryString ? `?${queryString}` : ""}`;

    return this.request<Template[]>(endpoint);
  }

  async uploadTemplate(file: File): Promise<Template> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<Template>("/templates", {
      method: "POST",
      body: formData,
    });
  }

  async getTemplate(templateId: string): Promise<Template> {
    return this.request<Template>(`/templates/${templateId}`);
  }

  async deleteTemplate(templateId: string): Promise<void> {
    await this.request<{ message: string }>(`/templates/${templateId}`, {
      method: "DELETE",
    });
  }

  async downloadTemplate(templateId: string): Promise<DownloadUrlResponse> {
    return this.request<DownloadUrlResponse>(`/templates/${templateId}/download`);
  }

  async toggleTemplateFavorite(templateId: string): Promise<Template> {
    return this.request<Template>(`/templates/${templateId}/favorite`, {
      method: "POST",
    });
  }

  // Variable Mapping
  async saveVariableMappings(
    templateId: string,
    mappings: Record<string, VariableMapping>
  ): Promise<Template> {
    return this.request<Template>(`/templates/${templateId}/mappings`, {
      method: "PUT",
      body: JSON.stringify({ variable_mappings: mappings }),
    });
  }

  // Document Generation
  async generateDocument(params: {
    template_id: string;
    name: string;
    variables: Record<string, string | number | boolean>;
    generation_settings?: GenerationSettings;
    tags?: string[];
    notes?: string;
  }): Promise<GeneratedDocument> {
    return this.request<GeneratedDocument>("/generate", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async generateWithFormatting(params: {
    template_id: string;
    name: string;
    variables: Record<string, string | number | boolean>;
  }): Promise<{ session_id: string; document_id: string }> {
    return this.request<{ session_id: string; document_id: string }>(
      "/generate/format",
      {
        method: "POST",
        body: JSON.stringify(params),
      }
    );
  }

  // Document Management
  async listDocuments(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<GeneratedDocument[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.set("skip", params.skip.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);

    const queryString = searchParams.toString();
    const endpoint = `/documents${queryString ? `?${queryString}` : ""}`;

    return this.request<GeneratedDocument[]>(endpoint);
  }

  async getDocument(documentId: string): Promise<GeneratedDocument> {
    return this.request<GeneratedDocument>(`/documents/${documentId}`);
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.request<{ message: string }>(`/documents/${documentId}`, {
      method: "DELETE",
    });
  }

  async downloadDocument(documentId: string): Promise<DownloadUrlResponse> {
    return this.request<DownloadUrlResponse>(`/documents/${documentId}/download`);
  }

  // Variable Detection (standalone) - uses template upload endpoint
  async detectVariables(file: File): Promise<VariableDetection> {
    const formData = new FormData();
    formData.append("file", file);

    // This returns a Template which includes variables_detected
    const template = await this.request<Template>("/templates", {
      method: "POST",
      body: formData,
    });

    return template.variables_detected;
  }
}

// Export singleton instance
export const dockoService = new DockoService();
