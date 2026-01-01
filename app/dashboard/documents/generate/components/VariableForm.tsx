"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Database, Edit3, Lock } from "lucide-react";

interface VariableMapping {
  type: "property" | "manual" | "static";
  field?: string;
  label?: string;
  value?: string;
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

interface VariableFormProps {
  template: Template;
  variables: Record<string, string>;
  onChange: (variables: Record<string, string>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VariableForm({
  template,
  variables,
  onChange,
  onNext,
  onBack,
}: VariableFormProps) {
  const handleChange = (variable: string, value: string) => {
    onChange({ ...variables, [variable]: value });
  };

  const getMapping = (variable: string): VariableMapping | undefined => {
    return template.variable_mappings?.[variable];
  };

  const getMappingIcon = (type: string) => {
    switch (type) {
      case "property":
        return <Database className="h-3 w-3" />;
      case "manual":
        return <Edit3 className="h-3 w-3" />;
      case "static":
        return <Lock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getMappingBadge = (mapping: VariableMapping | undefined) => {
    if (!mapping) {
      return (
        <Badge variant="outline" className="text-xs">
          <Edit3 className="mr-1 h-3 w-3" />
          Manual
        </Badge>
      );
    }

    switch (mapping.type) {
      case "property":
        return (
          <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
            {getMappingIcon(mapping.type)}
            <span className="ml-1">Auto-fill: {mapping.field}</span>
          </Badge>
        );
      case "static":
        return (
          <Badge className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-100">
            {getMappingIcon(mapping.type)}
            <span className="ml-1">Statis</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {getMappingIcon(mapping.type)}
            <span className="ml-1">Manual</span>
          </Badge>
        );
    }
  };

  // Group variables by type
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Review & Edit Variabel</h3>
        <p className="text-sm text-gray-500">
          Periksa nilai variabel yang terisi otomatis dan lengkapi yang masih
          kosong
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Terisi:</span>
        <span className="font-medium">
          {filledCount} / {totalCount}
        </span>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs">
          <div
            className="h-full bg-c-blue transition-all"
            style={{ width: `${(filledCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Auto-filled from Property */}
      {propertyVariables.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Terisi Otomatis dari Data Properti
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {propertyVariables.map((variable) => {
              const mapping = getMapping(variable);
              return (
                <div key={variable} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={variable}
                      className="text-sm font-mono text-gray-700"
                    >
                      {`{{${variable}}}`}
                    </Label>
                    {getMappingBadge(mapping)}
                  </div>
                  <Input
                    id={variable}
                    value={variables[variable] || ""}
                    onChange={(e) => handleChange(variable, e.target.value)}
                    placeholder={`Nilai untuk ${variable}`}
                    className="bg-blue-50"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Input Required */}
      {manualVariables.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-orange-700 flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Perlu Diisi Manual
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {manualVariables.map((variable) => {
              const mapping = getMapping(variable);
              const label = mapping?.label || variable.replace(/_/g, " ");
              return (
                <div key={variable} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={variable}
                      className="text-sm font-mono text-gray-700"
                    >
                      {`{{${variable}}}`}
                    </Label>
                    {getMappingBadge(mapping)}
                  </div>
                  <Input
                    id={variable}
                    value={variables[variable] || ""}
                    onChange={(e) => handleChange(variable, e.target.value)}
                    placeholder={`Masukkan ${label}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Static Values */}
      {staticVariables.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Nilai Statis
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {staticVariables.map((variable) => {
              const mapping = getMapping(variable);
              return (
                <div key={variable} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={variable}
                      className="text-sm font-mono text-gray-700"
                    >
                      {`{{${variable}}}`}
                    </Label>
                    {getMappingBadge(mapping)}
                  </div>
                  <Input
                    id={variable}
                    value={variables[variable] || mapping?.value || ""}
                    onChange={(e) => handleChange(variable, e.target.value)}
                    className="bg-gray-50"
                    readOnly
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <Button onClick={onNext}>
          Lanjut ke Generate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
