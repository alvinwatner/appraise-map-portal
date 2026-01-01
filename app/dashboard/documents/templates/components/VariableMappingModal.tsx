"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Info } from "lucide-react";
import { dockoService } from "@/app/services/docko.service";

// Available property fields for mapping
const PROPERTY_FIELDS = [
  { value: "debitur", label: "Nama Debitur/Klien" },
  { value: "phoneNumber", label: "Nomor Telepon" },
  { value: "objectType", label: "Jenis Objek" },
  { value: "landArea", label: "Luas Tanah (m²)" },
  { value: "buildingArea", label: "Luas Bangunan (m²)" },
  { value: "locations.address", label: "Alamat Lengkap" },
  { value: "locations.latitude", label: "Latitude" },
  { value: "locations.longitude", label: "Longitude" },
  { value: "valuations[0].valuationDate", label: "Tanggal Penilaian" },
  { value: "valuations[0].landValue", label: "Nilai Tanah/m²" },
  { value: "valuations[0].buildingValue", label: "Nilai Bangunan/m²" },
  { value: "valuations[0].totalValue", label: "Nilai Total" },
  { value: "valuations[0].reportNumber", label: "Nomor Laporan" },
  { value: "valuations[0].appraiser", label: "Nama Penilai" },
];

type MappingType = "property" | "manual" | "static";

interface VariableMapping {
  type: MappingType;
  field?: string; // For property type
  label?: string; // For manual type
  value?: string; // For static type
}

interface Template {
  id: string;
  name: string;
  variables_detected: {
    simple: string[];
    sections: string[];
  };
  variable_mappings?: Record<string, VariableMapping>;
}

interface VariableMappingModalProps {
  template: Template;
  onClose: () => void;
  onSave: (mappings: Record<string, VariableMapping>) => void;
}

export function VariableMappingModal({
  template,
  onClose,
  onSave,
}: VariableMappingModalProps) {
  const [mappings, setMappings] = useState<Record<string, VariableMapping>>(
    () => {
      // Initialize with existing mappings or defaults
      const initial: Record<string, VariableMapping> = {};
      template.variables_detected.simple.forEach((variable) => {
        initial[variable] = template.variable_mappings?.[variable] || {
          type: "manual",
          label: variable.replace(/_/g, " "),
        };
      });
      return initial;
    }
  );
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (variable: string, type: MappingType) => {
    setMappings((prev) => ({
      ...prev,
      [variable]: {
        type,
        ...(type === "manual" && { label: variable.replace(/_/g, " ") }),
        ...(type === "static" && { value: "" }),
        ...(type === "property" && { field: "" }),
      },
    }));
  };

  const handleFieldChange = (variable: string, field: string) => {
    setMappings((prev) => ({
      ...prev,
      [variable]: { ...prev[variable], field },
    }));
  };

  const handleStaticValueChange = (variable: string, value: string) => {
    setMappings((prev) => ({
      ...prev,
      [variable]: { ...prev[variable], value },
    }));
  };

  const handleLabelChange = (variable: string, label: string) => {
    setMappings((prev) => ({
      ...prev,
      [variable]: { ...prev[variable], label },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await dockoService.saveVariableMappings(template.id, mappings);
      onSave(mappings);
    } catch (error) {
      console.error("Failed to save mappings:", error);
    } finally {
      setSaving(false);
    }
  };

  const allVariables = template.variables_detected.simple;
  const configuredCount = Object.values(mappings).filter(
    (m) =>
      (m.type === "property" && m.field) ||
      (m.type === "static" && m.value) ||
      m.type === "manual"
  ).length;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Konfigurasi Variabel - {template.name}</DialogTitle>
          <DialogDescription>
            Petakan variabel template ke field properti atau tentukan nilai
            manual/statis.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="rounded-lg bg-blue-50 p-3 mb-4 flex gap-2">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Tipe Mapping:</p>
              <ul className="mt-1 space-y-1">
                <li>
                  <strong>Field Properti</strong> - Otomatis diisi dari data
                  properti
                </li>
                <li>
                  <strong>Input Manual</strong> - User mengisi saat generate
                  dokumen
                </li>
                <li>
                  <strong>Nilai Statis</strong> - Nilai tetap untuk semua
                  dokumen
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {allVariables.map((variable) => (
              <div
                key={variable}
                className="border rounded-lg p-4 space-y-3 bg-white"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono">
                    {`{{${variable}}}`}
                  </Badge>
                  <Select
                    value={mappings[variable]?.type || "manual"}
                    onValueChange={(value) =>
                      handleTypeChange(variable, value as MappingType)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property">Field Properti</SelectItem>
                      <SelectItem value="manual">Input Manual</SelectItem>
                      <SelectItem value="static">Nilai Statis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Field Selector */}
                {mappings[variable]?.type === "property" && (
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">
                      Pilih Field Properti
                    </Label>
                    <Select
                      value={mappings[variable]?.field || ""}
                      onValueChange={(value) =>
                        handleFieldChange(variable, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih field..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_FIELDS.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Manual Input Label */}
                {mappings[variable]?.type === "manual" && (
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">
                      Label untuk Input
                    </Label>
                    <Input
                      value={mappings[variable]?.label || ""}
                      onChange={(e) =>
                        handleLabelChange(variable, e.target.value)
                      }
                      placeholder="Label yang ditampilkan saat generate"
                    />
                  </div>
                )}

                {/* Static Value Input */}
                {mappings[variable]?.type === "static" && (
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Nilai Statis</Label>
                    <Input
                      value={mappings[variable]?.value || ""}
                      onChange={(e) =>
                        handleStaticValueChange(variable, e.target.value)
                      }
                      placeholder="Nilai yang sama untuk semua dokumen"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-gray-500">
              {configuredCount} dari {allVariables.length} variabel dikonfigurasi
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Mapping
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
