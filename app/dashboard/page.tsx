"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Chart from "chart.js/auto";
import BarChart from "./components/BarChart";
import NumberCard from "./components/NumberCard";
import PieChart from "./components/PieChart";

export default function Page() {
  return (
    <div className="flex flex-col h-full p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 pl-28">Dashboard</h1>
      <div className="flex-1 flex justify-center items-center mb-5">
        <div className="w-full max-w-4xl bg-white shadow rounded-lg p-6 flex justify-center items-center">
          <BarChart />
        </div>
      </div>
      <div className="flex justify-center gap-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <NumberCard title="Total Assessed Property" value={670} />
          <NumberCard title="Total Unassessed Property" value={510} />
          <NumberCard title="Total Assesses" value={460} />{" "}
          <NumberCard title="Total Assesses" value={460} />{" "}
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex justify-center items-center">
          <PieChart />
        </div>
      </div>
    </div>
  );
}
