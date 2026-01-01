"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Building2,
  Settings2,
  Loader2,
  CheckCircle2,
  Download,
  Sparkles,
} from "lucide-react";
import { PropertySelector } from "./components/PropertySelector";
import { VariableForm } from "./components/VariableForm";
import { dockoService } from "@/app/services/docko.service";
import { Property } from "@/app/types/types";

// Types
interface Template {
  id: string;
  name: string;
  variables_detected: {
    simple: string[];
    sections: string[];
  };
  variable_mappings?: Record<string, {
    type: "property" | "manual" | "static";
    field?: string;
    label?: string;
    value?: string;
  }>;
  has_mapping: boolean;
}

type Step = "template" | "property" | "variables" | "generate";

export default function GenerateDocumentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get("template");
  const [currentStep, setCurrentStep] = useState<Step>("template");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Form state
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [documentName, setDocumentName] = useState("");
  const [autoFormat, setAutoFormat] = useState(false);
  const [exportFormat, setExportFormat] = useState<"docx" | "pdf">("docx");

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generatedDocId, setGeneratedDocId] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const allTemplates = await dockoService.listTemplates();
      // Filter to only show templates with mappings configured
      const templatesWithMapping = allTemplates.filter((t) => t.variable_mappings && Object.keys(t.variable_mappings).length > 0);
      setTemplates(templatesWithMapping.map((t) => ({
        ...t,
        has_mapping: true,
      })));
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Auto-select template from URL query param
  useEffect(() => {
    if (templateIdParam && templates.length > 0 && !selectedTemplate) {
      const template = templates.find((t) => t.id === templateIdParam);
      if (template) {
        setSelectedTemplate(template);
        setCurrentStep("property");
      }
    }
  }, [templateIdParam, templates, selectedTemplate]);

  // Auto-fill variables when property is selected
  useEffect(() => {
    if (selectedTemplate && selectedProperty && selectedTemplate.variable_mappings) {
      const mappings = selectedTemplate.variable_mappings;
      const newVariables: Record<string, string> = {};

      selectedTemplate.variables_detected.simple.forEach((variable) => {
        const mapping = mappings[variable];
        if (!mapping) return;

        if (mapping.type === "static" && mapping.value) {
          newVariables[variable] = mapping.value;
        } else if (mapping.type === "property" && mapping.field) {
          // Get value from property using field path
          const value = getPropertyValue(selectedProperty, mapping.field);
          if (value !== undefined && value !== null) {
            newVariables[variable] = formatValue(value, mapping.field);
          }
        }
        // Manual fields remain empty for user input
      });

      setVariables(newVariables);

      // Set default document name
      if (!documentName) {
        setDocumentName(`${selectedTemplate.name} - ${selectedProperty.debitur}`);
      }
    }
  }, [selectedTemplate, selectedProperty]);

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

    // Format currency values
    if (fieldPath.includes("Value") || fieldPath.includes("value")) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(Number(value));
    }

    // Format area values
    if (fieldPath.includes("Area")) {
      return `${value} m²`;
    }

    return String(value);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentStep("property");
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentStep("variables");
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    setGenerating(true);
    try {
      if (autoFormat) {
        // Use background formatting with live progress
        const result = await dockoService.generateWithFormatting({
          template_id: selectedTemplate.id,
          name: documentName,
          variables: variables,
        });
        // Redirect to live formatting page
        router.push(`/dashboard/documents/format-live?session=${result.session_id}`);
      } else {
        // Simple generation
        const result = await dockoService.generateDocument({
          template_id: selectedTemplate.id,
          name: documentName,
          variables: variables,
          generation_settings: {
            auto_formatting: false,
            export_format: exportFormat,
          },
        });
        setGeneratedDocId(result.id);
        setGenerationComplete(true);
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedDocId) return;

    try {
      const response = await dockoService.downloadDocument(generatedDocId);
      window.open(response.download_url, "_blank");
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const steps = [
    { key: "template", label: "Pilih Template", icon: FileText },
    { key: "property", label: "Pilih Properti", icon: Building2 },
    { key: "variables", label: "Isi Variabel", icon: Settings2 },
    { key: "generate", label: "Generate", icon: Sparkles },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Generate Dokumen
          </h2>
          <p className="text-sm text-gray-500">
            Buat dokumen baru dari template
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === currentStep;
          const isComplete = index < currentStepIndex;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    isComplete
                      ? "border-green-500 bg-green-500 text-white"
                      : isActive
                      ? "border-c-blue bg-c-blue text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive ? "text-c-blue" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-16 ${
                    index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="mt-8">
        {/* Step 1: Select Template */}
        {currentStep === "template" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pilih Template</h3>
            <p className="text-sm text-gray-500">
              Pilih template yang sudah dikonfigurasi mapping variabelnya
            </p>

            {loadingTemplates ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : templates.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">
                    Belum ada template dengan mapping variabel.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push("/dashboard/documents/templates")}
                  >
                    Kelola Template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:border-c-blue ${
                      selectedTemplate?.id === template.id
                        ? "border-c-blue ring-1 ring-c-blue"
                        : ""
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        {template.has_mapping && (
                          <Badge className="bg-green-100 text-green-700">
                            Configured
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {template.variables_detected.simple.length} variabel
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {template.variables_detected.simple.slice(0, 4).map((v) => (
                          <Badge key={v} variant="secondary" className="text-xs">
                            {v}
                          </Badge>
                        ))}
                        {template.variables_detected.simple.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.variables_detected.simple.length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Property */}
        {currentStep === "property" && (
          <PropertySelector
            onSelect={handleSelectProperty}
            onBack={() => setCurrentStep("template")}
          />
        )}

        {/* Step 3: Fill Variables */}
        {currentStep === "variables" && selectedTemplate && (
          <VariableForm
            template={selectedTemplate}
            variables={variables}
            onChange={setVariables}
            onNext={() => setCurrentStep("generate")}
            onBack={() => setCurrentStep("property")}
          />
        )}

        {/* Step 4: Generate */}
        {currentStep === "generate" && (
          <div className="max-w-xl space-y-6">
            <h3 className="text-lg font-medium">Opsi Generate</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="docName">Nama Dokumen</Label>
                <Input
                  id="docName"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Nama dokumen"
                />
              </div>

              <div className="space-y-2">
                <Label>Format Export</Label>
                <Select
                  value={exportFormat}
                  onValueChange={(v) => setExportFormat(v as "docx" | "pdf")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="docx">DOCX (Word)</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoFormat"
                  checked={autoFormat}
                  onCheckedChange={(checked) => setAutoFormat(checked as boolean)}
                />
                <Label htmlFor="autoFormat" className="text-sm cursor-pointer">
                  Auto-formatting (perbaikan spasi & layout otomatis)
                </Label>
              </div>
            </div>

            {/* Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ringkasan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Template:</span>
                  <span className="font-medium">{selectedTemplate?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Properti:</span>
                  <span className="font-medium">{selectedProperty?.debitur}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Variabel terisi:</span>
                  <span className="font-medium">
                    {Object.keys(variables).filter((k) => variables[k]).length} /{" "}
                    {selectedTemplate?.variables_detected.simple.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {generationComplete ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      Dokumen berhasil dibuat!
                    </p>
                    <p className="text-sm text-green-600">
                      Klik tombol di bawah untuk mengunduh
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Dokumen
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/documents/generated")}
                  >
                    Lihat Semua Dokumen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep("variables")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={generating || !documentName}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Dokumen
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
