/**
 * Docko API TypeScript Types
 *
 * Type definitions for Docko document automation integration.
 */

// Variable Detection
export interface VariableDetection {
  simple: string[];
  sections: string[];
  total_count: number;
}

// Variable Mapping Configuration
export type MappingType = "property" | "manual" | "static";

export interface VariableMapping {
  type: MappingType;
  field?: string; // For property type - maps to property database field
  label?: string; // For manual type - label shown during generation
  value?: string; // For static type - fixed value
  format?: "currency" | "date" | "number" | "text"; // Optional formatting
}

// Template
export interface Template {
  id: string;
  name: string;
  description: string;
  original_filename: string;
  file_size_bytes: number;
  variables_detected: VariableDetection;
  variable_mappings?: Record<string, VariableMapping>;
  tags: string[];
  category: string;
  usage_count: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
  has_mapping?: boolean;
}

// Generated Document
export interface GeneratedDocument {
  id: string;
  template_id: string | null;
  name: string;
  generated_filename: string;
  export_format: "docx" | "pdf";
  file_size_bytes: number;
  status: "completed" | "processing" | "failed";
  error_message?: string;
  download_count: number;
  tags: string[];
  is_favorite: boolean;
  notes: string;
  created_at: string;
  last_downloaded_at: string | null;
  variables_used?: Record<string, unknown>;
}

// Generation Settings
export interface GenerationSettings {
  auto_formatting: boolean;
  export_format: "docx" | "pdf";
}

// Download URL Response
export interface DownloadUrlResponse {
  download_url: string;
  expires_in: number;
  filename: string;
}

// Property Fields available for mapping
export interface PropertyFieldOption {
  value: string;
  label: string;
  path: string; // Dot notation path for nested fields
  type: "string" | "number" | "date" | "currency";
}

export const PROPERTY_FIELD_OPTIONS: PropertyFieldOption[] = [
  { value: "debitur", label: "Nama Debitur/Klien", path: "debitur", type: "string" },
  { value: "phoneNumber", label: "Nomor Telepon", path: "phoneNumber", type: "string" },
  { value: "objectType", label: "Jenis Objek", path: "objectType", type: "string" },
  { value: "landArea", label: "Luas Tanah (m²)", path: "landArea", type: "number" },
  { value: "buildingArea", label: "Luas Bangunan (m²)", path: "buildingArea", type: "number" },
  { value: "locations.address", label: "Alamat Lengkap", path: "locations.address", type: "string" },
  { value: "locations.city", label: "Kota", path: "locations.city", type: "string" },
  { value: "locations.province", label: "Provinsi", path: "locations.province", type: "string" },
  { value: "locations.latitude", label: "Latitude", path: "locations.latitude", type: "number" },
  { value: "locations.longitude", label: "Longitude", path: "locations.longitude", type: "number" },
  { value: "valuations[0].valuationDate", label: "Tanggal Penilaian", path: "valuations[0].valuationDate", type: "date" },
  { value: "valuations[0].landValue", label: "Nilai Tanah/m²", path: "valuations[0].landValue", type: "currency" },
  { value: "valuations[0].buildingValue", label: "Nilai Bangunan/m²", path: "valuations[0].buildingValue", type: "currency" },
  { value: "valuations[0].totalValue", label: "Nilai Total", path: "valuations[0].totalValue", type: "currency" },
  { value: "valuations[0].reportNumber", label: "Nomor Laporan", path: "valuations[0].reportNumber", type: "string" },
  { value: "valuations[0].appraiser", label: "Nama Penilai", path: "valuations[0].appraiser", type: "string" },
];

// Property data structure (from appraise-map-portal)
export interface PropertyData {
  id: string;
  debitur: string;
  phoneNumber?: string;
  objectType: string;
  landArea?: number;
  buildingArea?: number;
  locations: {
    address: string;
    city?: string;
    province?: string;
    latitude: number;
    longitude: number;
  };
  valuations: Array<{
    valuationDate: string;
    landValue?: number;
    buildingValue?: number;
    totalValue: number;
    reportNumber?: string;
    appraiser?: string;
  }>;
}

// Formatting Progress (for Firestore streaming)
export interface FormattingProgress {
  session_id: string;
  current_action: string;
  latest_pdf_url?: string;
  document_id?: string;
  status: "processing" | "completed" | "failed";
  error_message?: string;
  history: Array<{
    action: string;
    timestamp: string;
  }>;
  last_updated: Date;
}

// API Request/Response types
export interface CreateTemplateRequest {
  name: string;
  description?: string;
  tags?: string[];
  category?: string;
}

export interface CreateDocumentRequest {
  template_id: string;
  name: string;
  variables: Record<string, unknown>;
  generation_settings?: GenerationSettings;
  tags?: string[];
  notes?: string;
}

export interface UpdateMappingsRequest {
  variable_mappings: Record<string, VariableMapping>;
}
