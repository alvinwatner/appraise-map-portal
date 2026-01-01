"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard/documents/templates", label: "Template" },
    { href: "/dashboard/documents/generated", label: "Dokumen" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Dokumen</h1>
          <Badge variant="secondary">Beta</Badge>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Kelola template dan generate dokumen otomatis dari data properti
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b bg-white px-6">
        <nav className="flex gap-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                pathname === tab.href
                  ? "border-c-blue text-c-blue"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">{children}</div>
    </div>
  );
}
