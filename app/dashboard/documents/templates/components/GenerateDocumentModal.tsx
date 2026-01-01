"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  Download,
  Database,
  Edit3,
  Lock,
  Search,
  MapPin,
  Building2,
  X,
} from "lucide-react";
import { fetchProperties } from "@/app/services/dataManagement.service";
import {
  dockoService,
  Template,
  VariableMapping,
} from "@/app/services/docko.service";
import { Property } from "@/app/types/types";

interface GenerateDocumentModalProps {
  template: Template;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GenerateDocumentModal({
  template,
  onClose,
  onSuccess,
}: GenerateDocumentModalProps) {
  // Property selection
  const [usePropertyData, setUsePropertyData] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Variables
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [documentName, setDocumentName] = useState(template.name);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generatedDocId, setGeneratedDocId] = useState<string | null>(null);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [applyingFormat, setApplyingFormat] = useState(false);

  const router = useRouter();

  // Load properties when toggle is enabled
  const loadProperties = useCallback(async (search?: string) => {
    setLoadingProperties(true);
    try {
      const result = await fetchProperties(search, 1, 100);
      setProperties(result.data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  useEffect(() => {
    if (usePropertyData) {
      loadProperties();
    }
  }, [usePropertyData, loadProperties]);

  // Debounced search
  useEffect(() => {
    if (!usePropertyData) return;
    const timeoutId = setTimeout(() => {
      loadProperties(searchQuery || undefined);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, usePropertyData, loadProperties]);

  // Helper functions for property value extraction
  const getPropertyValue = (property: Property, fieldPath: string): unknown => {
    const parts = fieldPath.split(/[.[\]]+/).filter(Boolean);
    let value: unknown = property;
    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = (value as Record<string, unknown>)[part];
    }
    return value;
  };

  const formatValue = (value: unknown, fieldPath: string): string => {
    if (value === null || value === undefined) return "";

    if (fieldPath.includes("Value") || fieldPath.includes("value")) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(Number(value));
    }

    if (fieldPath.includes("Area")) {
      return `${value} m²`;
    }

    return String(value);
  };

  // Auto-fill variables from property
  const autoFillVariables = useCallback(
    (property: Property) => {
      if (!template.variable_mappings) return;

      const mappings = template.variable_mappings;
      const newVariables: Record<string, string> = {};

      template.variables_detected.simple.forEach((variable) => {
        const mapping = mappings[variable];
        console.log(`Variable: ${variable}, Mapping:`, mapping);

        if (!mapping) return;

        if (mapping.type === "static" && mapping.value) {
          newVariables[variable] = mapping.value;
        } else if (mapping.type === "property" && mapping.field) {
          const value = getPropertyValue(property, mapping.field);
          console.log(`  Field: ${mapping.field}, Value:`, value);

          if (value !== undefined && value !== null) {
            newVariables[variable] = formatValue(value, mapping.field);
          }
        }
      });

      setVariables(newVariables);
      setDocumentName(`${template.name} - ${property.debitur}`);
    },
    [
      template.variable_mappings,
      template.variables_detected.simple,
      template.name,
    ]
  );

  // Handle property selection
  useEffect(() => {
    if (selectedPropertyId && properties.length > 0) {
      const property = properties.find(
        (p) => p.id.toString() === selectedPropertyId
      );
      if (property) {
        setSelectedProperty(property);
        autoFillVariables(property);
      }
    }
  }, [selectedPropertyId, properties, autoFillVariables]);

  // Initialize static variables on mount
  useEffect(() => {
    if (template.variable_mappings) {
      const staticVars: Record<string, string> = {};
      template.variables_detected.simple.forEach((variable) => {
        const mapping = template.variable_mappings?.[variable];
        if (mapping?.type === "static" && mapping.value) {
          staticVars[variable] = mapping.value;
        }
      });
      setVariables(staticVars);
    }
  }, [template]);

  // Clear property when toggle is disabled
  const handleTogglePropertyData = (enabled: boolean) => {
    setUsePropertyData(enabled);
    if (!enabled) {
      setSelectedProperty(null);
      setSelectedPropertyId("");
      // Keep only static variables
      const staticVars: Record<string, string> = {};
      template.variables_detected.simple.forEach((variable) => {
        const mapping = template.variable_mappings?.[variable];
        if (mapping?.type === "static" && mapping.value) {
          staticVars[variable] = mapping.value;
        }
      });
      setVariables(staticVars);
      setDocumentName(template.name);
    }
  };

  // Clear selected property
  const handleClearProperty = () => {
    setSelectedProperty(null);
    setSelectedPropertyId("");
    // Reset to static variables only
    const staticVars: Record<string, string> = {};
    template.variables_detected.simple.forEach((variable) => {
      const mapping = template.variable_mappings?.[variable];
      if (mapping?.type === "static" && mapping.value) {
        staticVars[variable] = mapping.value;
      }
    });
    setVariables(staticVars);
    setDocumentName(template.name);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables((prev) => ({ ...prev, [variable]: value }));
  };

  const getMapping = (variable: string): VariableMapping | undefined => {
    return template.variable_mappings?.[variable];
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationError(null);
    try {
      // Call API directly to get blob response
      const response = await fetch("/api/docko/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: template.id,
          variables: variables,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Generation failed");
      }

      // Extract document ID from headers
      const documentId = response.headers.get("X-Document-ID");
      setGeneratedDocId(documentId);

      // Get blob for download
      const blob = await response.blob();
      setGeneratedBlob(blob);

      setGenerationComplete(true);
      onSuccess?.();
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationError(
        error instanceof Error ? error.message : "Generation failed"
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedBlob) return;

    // Create download link from blob
    const url = window.URL.createObjectURL(generatedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentName}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleApplyFormatting = async () => {
    if (!generatedBlob) return;

    setApplyingFormat(true);
    setGenerationError(null);
    try {
      const formData = new FormData();
      formData.append("file", generatedBlob, `${documentName}.docx`);

      const response = await fetch("/api/docko/format-advanced", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to start formatting");
      }

      const { session_id } = await response.json();

      // Redirect to live formatting page
      router.push(
        `/dashboard/documents/format-live?session=${session_id}&template=${template.id}`
      );
    } catch (error) {
      console.error("Formatting failed:", error);
      setGenerationError(
        error instanceof Error ? error.message : "Failed to start formatting"
      );
      setApplyingFormat(false);
    }
  };

  // Truncate address for display
  const truncateAddress = (address: string, maxLength: number = 40) => {
    if (!address) return "";
    return address.length > maxLength
      ? address.substring(0, maxLength) + "..."
      : address;
  };

  // Group variables
  const propertyVariables = template.variables_detected.simple.filter(
    (v) => getMapping(v)?.type === "property"
  );
  const manualVariables = template.variables_detected.simple.filter(
    (v) => getMapping(v)?.type === "manual" || !getMapping(v)
  );
  const staticVariables = template.variables_detected.simple.filter(
    (v) => getMapping(v)?.type === "static"
  );

  const filledCount = Object.values(variables).filter((v) => v).length;
  const totalCount = template.variables_detected.simple.length;
  const canGenerate = documentName && filledCount > 0;

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-c-blue" />
            Generate Dokumen
          </DialogTitle>
          <DialogDescription>
            Template: <span className="font-medium">{template.name}</span>
          </DialogDescription>
        </DialogHeader>

        {generationComplete ? (
          <div className="py-10 text-center space-y-6">
            {/* Checkmark with background */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>

            {/* Title and filename */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Dokumen Berhasil Dibuat!
              </h3>
              <p className="text-sm text-gray-500 truncate max-w-[280px] mx-auto">
                {documentName}
              </p>
            </div>

            {/* Error Message */}
            {generationError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {generationError}
              </div>
            )}

            {/* Stacked buttons */}
            <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
              <Button onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download DOCX
              </Button>
              <Button
                variant="outline"
                onClick={handleApplyFormatting}
                disabled={applyingFormat}
                className="w-full"
              >
                {applyingFormat ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Auto Format
                  </>
                )}
              </Button>
            </div>

            {/* Close button */}
            <Button variant="ghost" size="sm" onClick={onClose}>
              Tutup
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Document Name */}
            <div className="space-y-2">
              <Label htmlFor="docName">Nama Dokumen</Label>
              <Input
                id="docName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Nama dokumen"
              />
            </div>

            {/* Property Selection Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Link ke Data Properti</Label>
                  <p className="text-xs text-gray-500">
                    Auto-fill variabel dari data properti yang ada
                  </p>
                </div>
                <Switch
                  checked={usePropertyData}
                  onCheckedChange={handleTogglePropertyData}
                />
              </div>

              {/* Property Selector */}
              {usePropertyData && !selectedProperty && (
                <Select
                  value={selectedPropertyId}
                  onValueChange={setSelectedPropertyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih properti..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-hidden">
                    <div className="px-2 pb-2 sticky top-0 bg-white z-10 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Cari nama debitur atau alamat..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 h-8"
                        />
                      </div>
                    </div>
                    <div className="max-h-[250px] overflow-y-auto">
                      {loadingProperties ? (
                        <div className="py-4 text-center">
                          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                        </div>
                      ) : properties.length === 0 ? (
                        <div className="py-4 text-center text-sm text-gray-500">
                          Tidak ada properti ditemukan
                        </div>
                      ) : (
                        properties.map((property) => (
                          <SelectItem
                            key={property.id}
                            value={property.id.toString()}
                            className="py-2"
                          >
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {property.debitur || `ID: ${property.id}`}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {property.objectType}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="truncate max-w-[200px]">
                                  {property.locations?.address || "-"}
                                </span>
                                {(property.landArea ||
                                  property.buildingArea) && (
                                  <>
                                    <span>•</span>
                                    <span className="whitespace-nowrap">
                                      {property.landArea &&
                                        `${property.landArea}m²`}
                                      {property.landArea &&
                                        property.buildingArea &&
                                        "/"}
                                      {property.buildingArea &&
                                        `${property.buildingArea}m²`}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </div>
                  </SelectContent>
                </Select>
              )}

              {/* Selected Property Card */}
              {usePropertyData && selectedProperty && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                          <span className="font-medium text-gray-900 truncate">
                            {selectedProperty.debitur}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs shrink-0"
                          >
                            {selectedProperty.objectType}
                          </Badge>
                        </div>
                        <div className="flex items-start gap-1.5 mt-1.5 text-xs text-gray-600">
                          <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">
                            {selectedProperty.locations?.address ||
                              "Alamat tidak tersedia"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {selectedProperty.landArea && (
                            <span>Tanah: {selectedProperty.landArea} m²</span>
                          )}
                          {selectedProperty.buildingArea && (
                            <span>
                              Bangunan: {selectedProperty.buildingArea} m²
                            </span>
                          )}
                          {selectedProperty.valuations?.[0]?.totalValue && (
                            <span className="text-blue-600 font-medium">
                              {formatCurrency(
                                selectedProperty.valuations[0].totalValue
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={handleClearProperty}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Variables Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Variabel</Label>
                <span className="text-xs text-gray-500">
                  {filledCount}/{totalCount} terisi
                </span>
              </div>

              {/* Auto-filled from Property */}
              {propertyVariables.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Database className="h-3 w-3" />
                    <span>
                      {usePropertyData && selectedProperty
                        ? "Auto-fill dari properti"
                        : "Perlu data properti (atau isi manual)"}
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {propertyVariables.map((variable) => (
                      <div key={variable} className="space-y-1">
                        <Label className="text-xs font-mono text-gray-500">
                          {variable}
                        </Label>
                        <Input
                          value={variables[variable] || ""}
                          onChange={(e) =>
                            handleVariableChange(variable, e.target.value)
                          }
                          className={`h-8 text-sm ${
                            usePropertyData && selectedProperty
                              ? "bg-blue-50"
                              : ""
                          }`}
                          placeholder={`Isi ${variable.replace(/_/g, " ")}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual */}
              {manualVariables.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <Edit3 className="h-3 w-3" />
                    <span>Isi manual</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {manualVariables.map((variable) => (
                      <div key={variable} className="space-y-1">
                        <Label className="text-xs font-mono text-gray-500">
                          {variable}
                        </Label>
                        <Input
                          value={variables[variable] || ""}
                          onChange={(e) =>
                            handleVariableChange(variable, e.target.value)
                          }
                          className="h-8 text-sm"
                          placeholder={`Isi ${variable.replace(/_/g, " ")}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Static */}
              {staticVariables.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Lock className="h-3 w-3" />
                    <span>Nilai statis</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {staticVariables.map((variable) => {
                      const mapping = getMapping(variable);
                      return (
                        <div key={variable} className="space-y-1">
                          <Label className="text-xs font-mono text-gray-500">
                            {variable}
                          </Label>
                          <Input
                            value={variables[variable] || mapping?.value || ""}
                            className="h-8 text-sm bg-gray-50"
                            readOnly
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {generationError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {generationError}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
