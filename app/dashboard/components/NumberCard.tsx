// components/NumberCard.tsx
import React from "react";

interface NumberCardProps {
  title: string;
  value: string;
}

const NumberCard: React.FC<NumberCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded-lg p-5 text-center ring-1">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-3xl font-bold mt-6">{value}</div>
    </div>
  );
};

export default NumberCard;
