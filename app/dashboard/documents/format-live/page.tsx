"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Clock,
} from "lucide-react";

interface FormattingProgress {
  session_id: string;
  current_action: string;
  latest_pdf_url?: string;
  document_id?: string;
  status?: "processing" | "completed" | "failed";
  error_message?: string;
  history: Array<{
    action: string;
    timestamp: string;
  }>;
  last_updated: Date;
}

export default function FormatLivePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session");

  const [progress, setProgress] = useState<FormattingProgress | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [latestPdfUrl, setLatestPdfUrl] = useState<string | null>(null); // Persists after Firestore cleanup
  const [documentId, setDocumentId] = useState<string | null>(null); // For downloading DOCX
  const [error, setError] = useState<string | null>(null);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID tidak ditemukan");
      return;
    }

    // Don't re-subscribe if already completed
    if (isCompleted) {
      return;
    }

    // Subscribe to Firestore document updates
    const docRef = doc(db, "document_formatting_progress", sessionId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as FormattingProgress;
          setProgress(data);

          // Update PDF preview URL if available
          if (data.latest_pdf_url) {
            setPdfUrl(data.latest_pdf_url);
            setLatestPdfUrl(data.latest_pdf_url); // Persist for download after Firestore cleanup
          }

          // Update document_id if available (for DOCX download)
          if (data.document_id) {
            setDocumentId(data.document_id);
          }

          // Clear error on successful data
          setError(null);

          const isComplete = data.status === "completed";
          console.log(`data.document_id = ${JSON.stringify(data.document_id)} and data = ${JSON.stringify(data)}`);

          if (isComplete) {
            setIsCompleted(true);
            unsubscribe();
          }
        } else {
          // Only show error if we haven't completed yet
          // (BE cleans up Firestore doc after completion)
          if (!isCompleted) {
            setError("Session tidak ditemukan. Mungkin sudah expired.");
          }
        }
      },
      (err) => {
        console.error("Firestore error:", err);
        if (!isCompleted) {
          setError("Gagal terhubung ke server. Coba refresh halaman.");
        }
      }
    );

    return () => unsubscribe();
  }, [sessionId, isCompleted]);

  const handleDownloadDocx = useCallback(async () => {
    if (!documentId) {
      console.log("No document ID available");
      return;
    }

    setDownloadingDocx(true);
    try {
      // Call backend API to download DOCX
      const response = await fetch(
        `/api/docko/documents/${documentId}/download`
      );

      if (!response.ok) {
        throw new Error("Failed to download document");
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "formatted_document.docx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloadingDocx(false);
    }
  }, [documentId]);

  const handleDownloadPdf = useCallback(() => {
    if (latestPdfUrl) {
      // Open PDF URL in new tab (pre-signed S3 URL)
      window.open(latestPdfUrl, "_blank");
    }
  }, [latestPdfUrl]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Session Tidak Valid
            </CardTitle>
            <CardDescription>
              Tidak ada session ID yang ditemukan. Silakan generate dokumen
              terlebih dahulu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/dashboard/documents/generate")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Generate
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
 
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="ml-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* PDF Preview - Left Column (2/3) */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-280px)] min-h-[500px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Preview PDF
              </CardTitle>
              <CardDescription>
                Preview akan diperbarui secara otomatis
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full rounded-lg border"
                  title="PDF Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border">
                  {progress?.status === "processing" ? (
                    <div className="text-center">
                      <Loader2 className="mx-auto h-10 w-10 animate-spin text-gray-400" />
                      <p className="mt-4 text-gray-500">
                        Menunggu preview tersedia...
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="mx-auto h-10 w-10 text-gray-300" />
                      <p className="mt-4 text-gray-500">
                        Preview belum tersedia
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Panel - Right Column (1/3) */}
        <div className="space-y-4 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          {/* Current Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              {progress ? (
                <div className="space-y-4">
                  {/* Current Action */}
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-sm font-medium text-blue-800">
                      {progress.current_action || "Mempersiapkan..."}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  {progress.status === "processing" && (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">
                        Sedang memproses...
                      </span>
                    </div>
                  )}

                  {progress.status === "completed" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Formatting selesai!
                      </span>
                    </div>
                  )}

                  {progress.status === "failed" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Terjadi kesalahan
                        </span>
                      </div>
                      {progress.error_message && (
                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          {progress.error_message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                {progress?.history && progress.history.length > 0 ? (
                  <div className="space-y-2">
                    {[...progress.history].reverse().map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-700 truncate">
                            {item.action}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTime(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Belum ada aktivitas
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Download Buttons */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Download</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={handleDownloadPdf}
                disabled={!latestPdfUrl || !isCompleted}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadDocx}
                disabled={!documentId || !isCompleted || downloadingDocx}
              >
                {downloadingDocx ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download DOCX
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
