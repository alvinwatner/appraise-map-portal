import { IoCalendarOutline, IoClose } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PiPencilSimpleLight } from "react-icons/pi";
import { PropertyChip, PropertyType } from "@/app/components/PropertyChip";
import { PropertyRowItem } from "@/app/components/PropertyInfoRowItem";
import { Property } from "../types/types";
import { MdPhone } from "react-icons/md";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { PiMapPinArea } from "react-icons/pi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

import { ValuationCardAsset } from "../dashboard/maps/components/ValuationCardAsset";
import { ValuationCardData } from "../dashboard/maps/components/ValuationCardData";

interface MarkerDetailContentProps {
  onClose: () => void;
  property: Property;
}

export const MarkerDetailContent: React.FC<MarkerDetailContentProps> = ({
  property,
  onClose,
}: MarkerDetailContentProps) => {
  return (
    <div className="relative w-full z-10 px-12 ">
      <button onClick={onClose}>
        <IoClose
          className="absolute right-5 top-6 z-0 "
          color="grey"
          size={25}
        />
      </button>

      <h3 className="text-lg font-medium mb-2">{property.object_type.name}</h3>
      {property.propertiesType == "asset" && (
        <h3 className="text-sm font-thin mb-2">{property.name}</h3>
      )}
      <PropertyChip
        type={
          property.propertiesType == "data"
            ? PropertyType.DATA
            : PropertyType.ASSET
        }
        className="mb-5"
      />
      <PropertyRowItem
        icon={HiOutlineLocationMarker}
        title="Lokasi :"
        body={property.locations.address}
        className="mb-6"
      />
      {property.propertiesType == "data" && (
        <PropertyRowItem
          icon={MdPhone}
          title="Nomor HP :"
          body={property.phoneNumber}
          className="mb-1"
        />
      )}
      <PropertyRowItem
        icon={PiMapPinArea}
        title="Luas Tanah :"
        body={property.landArea ? `${property.landArea.toString()} m2` : "-"}
        className="mb-1"
      />
      <PropertyRowItem
        icon={HiOutlineBuildingOffice2}
        title="Luas Bangunan :"
        body={
          property.buildingArea ? `${property.buildingArea.toString()} m2` : "-"
        }
        className="mb-1"
      />

      <div className="grid grid-cols-12 grid-rows-1 mb-5 ">
        <div className=" col-span-2 row-span-1 items-center  flex justify-start">
          <RiMoneyDollarBoxLine className="text-gray-500" size={24} />
        </div>
        <div className=" col-span-10 row-span-1 text-sm ">
          {property.propertiesType == "data"
            ? "Indikasi Penawaran :"
            : "Nilai :"}
        </div>
      </div>

      {property.valuations.map((valuation) => (
        <>
          {property.propertiesType == "asset" && (
            <ValuationCardAsset valuation={valuation} />
          )}

          {property.propertiesType == "data" && (
            <ValuationCardData valuation={valuation} />
          )}
        </>
      ))}

      <div className="grid grid-cols-2 gap-2 mb-10">
        <button className="flex items-center justify-center col-span-1 bg-[#5EABEE] hover:bg-blue-700 text-white font-bold py-2  rounded">
          Edit <PiPencilSimpleLight className="ml-2" />
        </button>
        <button className="flex items-center justify-center  col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete <RiDeleteBin5Line className="ml-2" />
        </button>
      </div>
    </div>
  );
};
