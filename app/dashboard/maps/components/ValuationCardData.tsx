import { Valuation } from "@/app/types/types";
import { MdOutlineCalendarMonth, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { formatRupiah } from "@/app/utils/helper";
import { format } from "date-fns";
import { PiArrowBendDownRightLight } from "react-icons/pi";
import { PropertyRowItem } from "@/app/dashboard/maps/components/PropertyRowItem";
import { TbReportMoney } from "react-icons/tb";
import { BsBuildingCheck } from "react-icons/bs";
import { TiChartAreaOutline } from "react-icons/ti";
import { useState } from "react";

interface ValuationCardDataProps {
  valuation: Valuation;
}

export const ValuationCardData: React.FC<ValuationCardDataProps> = ({
  valuation,
}: ValuationCardDataProps) => {

  const [isExpand, setIsExpand] = useState<boolean>(false);

  
  return (
    <div className="mb-10">
      <div className="relative flex flex-col bg-[#FFEBBF] py-2 pl-3 rounded-lg mb-3 shadow-lg">
        <p className="text-base mb-1">
          {valuation.totalValue != null
            ? formatRupiah(valuation.totalValue)
            : "-"}
        </p>
        <button
          className=""
          onClick={() => {
            setIsExpand(!isExpand);
          }}
        >
          {isExpand ? (
            <MdOutlineKeyboardArrowUp
              size={20}
              className="absolute mr-4 z-10 top-2 right-0 "
            />
          ) : (
            <MdOutlineKeyboardArrowDown
              size={20}
              className="absolute mr-4 z-10 top-2 right-0 "
            />
          )}
        </button>

        <p className="text-2sm mb-1 font-medium">{`${format(
          valuation.valuationDate,
          "dd/MM/yyyy"
        )} (Kevin)`}</p>
        <p className="text-2sm mb-1 font-thin font-100 italic tracking-wide">
          {" "}
          {valuation.reportNumber}
        </p>
      </div>

      {isExpand && (
        <div className="ml-4 relative">
          <PiArrowBendDownRightLight
            className="-ml-8 -mt-1 absolute "
            size={22}
          />


          <PropertyRowItem
            icon={MdOutlineCalendarMonth}
            title="Tanngal :"
            body={format(valuation.valuationDate, "dd/MM/yyyy")}
            className="mb-1"
          />

          <PropertyRowItem
            icon={BsBuildingCheck}
            title="Nilai Bangunan/Meter :"
            body={
              valuation.buildingValue != null
                ? formatRupiah(valuation.buildingValue)
                : "-"
            }
            className="mb-1"
          />

          <PropertyRowItem
            icon={TiChartAreaOutline}
            title="Nilai Tanah/Meter :"
            body={
              valuation.landValue != null
                ? formatRupiah(valuation.landValue)
                : "-"
            }
            className="mb-1"
          />

          <PropertyRowItem
            icon={TbReportMoney}
            title="Total Nilai :"
            body={
              valuation.totalValue != null
                ? formatRupiah(valuation.totalValue)
                : "-"
            }
            className="mb-1"
          />
        </div>
      )}
    </div>
  );
};
