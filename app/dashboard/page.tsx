"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import {
  fetchMaxTotalValueCurrentMonth,
  fetchMonthlyValuations2024,
  fetchTotalPropertiesCount,
  fetchTotalValuationCount,
  fetchYearlyValuations,
} from "../services/dataManagement.service";
import { formatRupiah } from "../utils/helper";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import a skeleton component
import React from "react";

export default function Page() {
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [yearlyData, setYearlyData] = useState<number[]>([]);
  const [totalAssesedAset, setTotalAssesedAset] = useState<number>(0);
  const [totalAssesedData, setTotalAssesedData] = useState<number>(0);
  const [totalAnnualValuation, setTotalAnnualValuation] = useState<number>(0);
  const [maxMonthlyValuation, setMaxMonthlyValuation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const results = await Promise.all([
        fetchMonthlyValuations2024(),
        fetchYearlyValuations(),
        fetchTotalPropertiesCount(true),
        fetchTotalPropertiesCount(false),
        fetchTotalValuationCount(),
        fetchMaxTotalValueCurrentMonth(),
      ]);

      // Update state with the results of all promises
      setMonthlyData(results[0]);
      setYearlyData(results[1]);
      setTotalAssesedAset(results[2]);
      setTotalAssesedData(results[3]);
      setTotalAnnualValuation(results[4]);
      setMaxMonthlyValuation(results[5]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-4 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center shrink-0">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>

      {/* KPI Strip - Primary Zone */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-4">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-7 w-16" />
            </Card>
          ))
        ) : (
          <>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Aset Ternilai
              </p>
              <p className="text-2xl font-bold text-teal-600 mt-1">
                {totalAssesedAset.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Data Pembanding
              </p>
              <p className="text-2xl font-bold text-teal-600 mt-1">
                {totalAssesedData.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Valuasi Tahunan
              </p>
              <p className="text-2xl font-bold text-teal-600 mt-1">
                {totalAnnualValuation.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Valuasi Tertinggi Bulanan
              </p>
              <p className="text-xl font-bold text-teal-600 mt-1">
                {formatRupiah(maxMonthlyValuation)}
              </p>
            </Card>
          </>
        )}
      </div>

      {/* Charts Row - Secondary Zone */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Bar Chart - 60% */}
        <div className="flex-[60] min-w-0">
          {loading ? (
            <Card className="w-full h-full flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </Card>
          ) : (
            <BarChart data={monthlyData} />
          )}
        </div>
        {/* Pie Chart - 40% */}
        <div className="flex-[40] min-w-0">
          {loading ? (
            <Card className="w-full h-full flex items-center justify-center">
              <Skeleton className="w-3/4 h-3/4" />
            </Card>
          ) : (
            <PieChart data={yearlyData} />
          )}
        </div>
      </div>
    </div>
  );
}
