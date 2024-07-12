"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BarChart from "./components/BarChart";
import NumberCard from "./components/NumberCard";
import PieChart from "./components/PieChart";

import {
  fetchMaxTotalValueCurrentMonth,
  fetchMonthlyValuations2024,
  fetchTotalPropertiesCount,
  fetchTotalValuationCount,
  fetchYearlyValuations,
} from "../services/dataManagement.service";
import { formatRupiah } from "../utils/helper";

export default function Page() {
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [yearlyData, setYearlyData] = useState<number[]>([]);
  const [totalAssesedAset, setTotalAssesedAset] = useState<number>(0);
  const [totalAssesedData, setTotalAssesedData] = useState<number>(0);
  const [totalAnnualValuation, setTotalAnnualValuation] = useState<number>(0);
  const [maxMonthlyValuation, setMaxMonthlyValuation] = useState<number>(0);

  const fetchSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      if (!session) {
        router.push('/login');
      } else {
        fetchData();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      router.push('/login');
    }
  }, [router]);

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
    }
  };

  useEffect(() => {
    fetchSession().then(fetchData);
  }, [fetchSession, router]);

  return (
    <div className="w-full h-full bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-6xl bg-white px-10 shadow-lg flex flex-col h-full overflow-hidden">
        <h1 className="text-3xl font-semibold my-4">Dashboard</h1>
        <div className="flex-1 flex flex-col">
          {" "}
          <div
            className="flex-initial ring-1 w-full bg-white shadow rounded-lg flex justify-center items-center mb-6"
            style={{ maxHeight: "50%" }}
          >
            <BarChart data={monthlyData} />
          </div>
          <div className="flex-grow w-full mb-6">
            <div className="flex justify-center gap-6 h-full">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <NumberCard
                  title="Total Aset Ternilai"
                  value={totalAssesedAset.toString()}
                />
                <NumberCard
                  title="Total Data Pembanding"
                  value={totalAssesedData.toString()}
                />
                <NumberCard
                  title="Total Valuasi Tahunan"
                  value={totalAnnualValuation.toString()}
                />
                <NumberCard
                  title="Valuasi Tertinggi Bulanan"
                  value={formatRupiah(maxMonthlyValuation)}
                />
              </div>
              <div
                className="bg-white ring-1 shadow rounded-lg p-5 flex justify-center items-center"
                style={{ width: "35%" }}
              >
                <PieChart data={yearlyData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
