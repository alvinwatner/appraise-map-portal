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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Import Card components
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
    <>
      <div className="p-4 lg:p-6 flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-full h-3/6 mb-6">
            {loading ? (
              <Skeleton className="w-full h-64" />
            ) : (
              <BarChart data={monthlyData} />
            )}
          </div>
          <div className="flex-grow w-full mb-6">
            <div className="flex justify-center gap-6 h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {/* Cards with Skeletons */}
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="flex flex-col p-6 shadow-md">
                      <CardHeader>
                        <Skeleton className="h-4 w-1/2 mb-2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <>
                    {/* Card for Total Aset Ternilai */}
                    <Card className="flex flex-col items-center justify-center">
                      <CardHeader className="flex items-center justify-center">
                        <CardTitle>Total Aset Ternilai</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold text-blue-600">
                          {totalAssesedAset.toString()}
                        </span>
                      </CardContent>
                    </Card>
                    {/* Card for Total Data Pembanding */}
                    <Card className="flex flex-col items-center justify-center">
                      <CardHeader>
                        <CardTitle>Total Data Pembanding</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold text-blue-600">
                          {totalAssesedData.toString()}
                        </span>
                      </CardContent>
                    </Card>
                    {/* Card for Total Valuasi Tahunan */}
                    <Card className="flex flex-col items-center justify-center">
                      <CardHeader>
                        <CardTitle>Total Valuasi Tahunan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold text-blue-600">
                          {totalAnnualValuation.toString()}
                        </span>
                      </CardContent>
                    </Card>
                    {/* Card for Valuasi Tertinggi Bulanan */}
                    <Card className="flex flex-col items-center justify-center">
                      <CardHeader>
                        <CardTitle>Valuasi Tertinggi Bulanan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatRupiah(maxMonthlyValuation)}
                        </span>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
              <Card
                className="flex justify-center items-center"
                style={{ width: "35%" }}
              >
                {loading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <CardContent className="flex items-center justify-center w-full h-full">
                    <PieChart data={yearlyData} />
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
