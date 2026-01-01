"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  MoreVertical,
  Star,
  Trash2,
  Download,
  Settings2,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadTemplateModal } from "./components/UploadTemplateModal";
import { VariableMappingModal } from "./components/VariableMappingModal";
import { GenerateDocumentModal } from "./components/GenerateDocumentModal";
import { dockoService, Template } from "@/app/services/docko.service";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateTemplate, setGenerateTemplate] = useState<Template | null>(
    null
  );

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const templates = await dockoService.listTemplates();
      setTemplates(templates);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = async (newTemplate: Template) => {
    console.log(`New template uploaded:`, newTemplate);
    setShowUploadModal(false);
    // Refresh templates list to get full template data
    await loadTemplates();
    // Fetch full template data and open mapping modal
    const fullTemplate = await dockoService.getTemplate(newTemplate.id);
    setSelectedTemplate(fullTemplate);
    setShowMappingModal(true);
  };

  const handleToggleFavorite = async (template: Template) => {
    try {
      await dockoService.toggleTemplateFavorite(template.id);
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === template.id ? { ...t, is_favorite: !t.is_favorite } : t
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDeleteTemplate = async (template: Template) => {
    if (!confirm(`Hapus template "${template.name}"?`)) return;

    try {
      await dockoService.deleteTemplate(template.id);
      setTemplates((prev) => prev.filter((t) => t.id !== template.id));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleDownloadTemplate = async (template: Template) => {
    try {
      const response = await dockoService.downloadTemplate(template.id);
      window.open(response.download_url, "_blank");
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  const handleConfigureMapping = (template: Template) => {
    setSelectedTemplate(template);
    setShowMappingModal(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {templates.length} template tersedia
          </p>
        </div>
        <Button variant="success" onClick={() => setShowUploadModal(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Template
        </Button>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-12 w-12 rounded-lg bg-gray-200" />
                <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Belum ada template
            </h3>
            <p className="mt-1 text-sm text-gray-500 text-center max-w-sm">
              Upload template dokumen DOCX dengan variabel {`{{nama_variabel}}`}{" "}
              untuk memulai generate dokumen otomatis.
            </p>
            <Button className="mt-4" onClick={() => setShowUploadModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Template Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="group relative hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                {/* Icon and Actions */}
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <FileText className="h-6 w-6 text-c-blue" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleFavorite(template)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          template.is_favorite
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleConfigureMapping(template)}
                        >
                          <Settings2 className="mr-2 h-4 w-4" />
                          Konfigurasi Mapping
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setGenerateTemplate(template);
                            setShowGenerateModal(true);
                          }}
                          disabled={!template.has_mapping}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Dokumen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadTemplate(template)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteTemplate(template)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Template Info */}
                <div className="mt-3">
                  <h3 className="font-medium text-gray-900 truncate">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {template.original_filename}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatFileSize(template.file_size_bytes)}</span>
                  <span>•</span>
                  <span>
                    {template.variables_detected.total_count} variabel
                  </span>
                </div>

                {/* Mapping Status */}
                <div className="mt-3">
                  {template.has_mapping ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Mapping Configured
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Perlu Konfigurasi
                    </Badge>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t text-xs text-gray-400">
                  Dibuat {formatDate(template.created_at)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadTemplateModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* Variable Mapping Modal */}
      {showMappingModal && selectedTemplate && (
        <VariableMappingModal
          template={selectedTemplate}
          onClose={() => {
            setShowMappingModal(false);
            setSelectedTemplate(null);
          }}
          onSave={() => {
            // Update template with mapping
            setTemplates((prev) =>
              prev.map((t) =>
                t.id === selectedTemplate.id ? { ...t, has_mapping: true } : t
              )
            );
            setShowMappingModal(false);
            setSelectedTemplate(null);
          }}
        />
      )}

      {/* Generate Document Modal */}
      {showGenerateModal && generateTemplate && (
        <GenerateDocumentModal
          template={generateTemplate}
          onClose={() => {
            setShowGenerateModal(false);
            setGenerateTemplate(null);
          }}
          onSuccess={() => {
            // Optionally refresh templates or show notification
          }}
        />
      )}
    </div>
  );
}
