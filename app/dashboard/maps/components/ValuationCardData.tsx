import { Valuation } from "@/app/types/types";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { formatRupiah } from "@/app/utils/helper";
import { format } from "date-fns";

interface ValuationCardDataProps {
  valuation: Valuation;
}

export const ValuationCardData: React.FC<ValuationCardDataProps> = ({
  valuation,
}: ValuationCardDataProps) => {
  return (
    <div className="relative flex flex-col bg-[#FFEBBF] py-2 pl-3 rounded-lg mb-10 shadow-lg">
      <p className="text-base mb-1">{formatRupiah(valuation.totalValue)}</p>

      <p className="text-2sm mb-1 font-medium">
        {format(valuation.valuationDate, "dd MMMM yyyy")}
      </p>
    </div>
  );
};
