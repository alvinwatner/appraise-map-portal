"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Building2,
  MapPin,
  Loader2,
} from "lucide-react";
import { fetchProperties } from "@/app/services/dataManagement.service";
import { Property } from "@/app/types/types";

interface PropertySelectorProps {
  onSelect: (property: Property) => void;
  onBack: () => void;
}

export function PropertySelector({ onSelect, onBack }: PropertySelectorProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const loadProperties = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const result = await fetchProperties(search, 1, 50);
      setProperties(result.data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        loadProperties(searchQuery);
      } else {
        loadProperties();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadProperties]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleContinue = () => {
    const selected = properties.find((p) => p.id === selectedId);
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Pilih Properti</h3>
          <p className="text-sm text-gray-500">
            Data properti akan digunakan untuk mengisi variabel template
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Cari properti..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Property List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">
            {searchQuery ? "Tidak ada hasil" : "Belum ada data properti"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {properties.map((property) => (
            <Card
              key={property.id}
              className={`cursor-pointer transition-all hover:border-c-blue ${
                selectedId === property.id
                  ? "border-c-blue ring-1 ring-c-blue"
                  : ""
              }`}
              onClick={() => setSelectedId(property.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{property.debitur}</CardTitle>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {property.objectType}
                  </span>
                </div>
                <CardDescription className="flex items-start gap-1">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                  {property.locations?.address || "-"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    {property.landArea && (
                      <span>Tanah: {property.landArea} m²</span>
                    )}
                    {property.landArea && property.buildingArea && " • "}
                    {property.buildingArea && (
                      <span>Bangunan: {property.buildingArea} m²</span>
                    )}
                  </div>
                  <div className="font-medium text-c-blue">
                    {formatCurrency(property.valuations?.[0]?.totalValue || 0)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <Button onClick={handleContinue} disabled={!selectedId}>
          Lanjut
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
