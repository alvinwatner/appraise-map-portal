"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { dockoService } from "@/app/services/docko.service";

interface UploadTemplateModalProps {
  onClose: () => void;
  onSuccess: (template: any) => void;
}

type UploadState = "idle" | "uploading" | "detecting" | "success" | "error";

export function UploadTemplateModal({ onClose, onSuccess }: UploadTemplateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [detectedVariables, setDetectedVariables] = useState<{
    simple: string[];
    sections: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploadState("uploading");
    setError(null);

    try {
      // Upload template to Docko API
      const template = await dockoService.uploadTemplate(file);

      setUploadState("detecting");

      // Variables are detected during upload, extract them
      setDetectedVariables({
        simple: template.variables_detected.simple,
        sections: template.variables_detected.sections,
      });

      setUploadState("success");

      // Wait a moment to show success state
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSuccess({
        ...template,
        has_mapping: false,
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Gagal mengupload template. Silakan coba lagi.");
      setUploadState("error");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setDetectedVariables(null);
    setUploadState("idle");
    setError(null);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Drop Zone */}
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-c-blue bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">
                {isDragActive ? "Drop file di sini..." : "Drag & drop file DOCX"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                atau klik untuk memilih file (max 10MB)
              </p>
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <FileText className="h-6 w-6 text-c-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                {uploadState === "idle" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadState === "uploading" && (
            <div className="flex items-center gap-3 text-blue-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Mengupload template...</span>
            </div>
          )}

          {uploadState === "detecting" && (
            <div className="flex items-center gap-3 text-blue-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Mendeteksi variabel...</span>
            </div>
          )}

          {/* Success - Show Detected Variables */}
          {uploadState === "success" && detectedVariables && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Variabel terdeteksi!</span>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {detectedVariables.simple.length} variabel ditemukan:
                </p>
                <div className="flex flex-wrap gap-2">
                  {detectedVariables.simple.map((variable) => (
                    <Badge key={variable} variant="secondary">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploadState !== "idle"}
          >
            {uploadState === "idle" && "Upload & Deteksi Variabel"}
            {uploadState === "uploading" && "Mengupload..."}
            {uploadState === "detecting" && "Mendeteksi..."}
            {uploadState === "success" && "Selesai"}
            {uploadState === "error" && "Coba Lagi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
