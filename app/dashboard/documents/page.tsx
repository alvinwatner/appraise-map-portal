"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to templates tab by default
    router.replace("/dashboard/documents/templates");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-500">Redirecting...</div>
    </div>
  );
}
