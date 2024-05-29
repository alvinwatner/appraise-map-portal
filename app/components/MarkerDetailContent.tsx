import { TbReportAnalytics } from "react-icons/tb";
import { IoCalendarOutline, IoClose } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PiPencilSimpleLight } from "react-icons/pi";
import { PropertyChip, PropertyType } from "@/app/components/PropertyChip";
import { PropertyRowItem } from "@/app/components/PropertyInfoRowItem";
import { Property } from "../types/types";

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

      <h3 className="text-lg font-medium">{property.name}</h3>
      <h3 className="text-sm font-thin mb-2">{property.users.username}</h3>
      <PropertyChip type={(property.propertiesType == 'data') ? PropertyType.DATA : PropertyType.ASSET} className="mb-5" />
      <PropertyRowItem
        icon={TbReportAnalytics}
        title="No Laporan :"
        body="00240/2.0113-02/PI/07/0518/1/V/2023"
        className="mb-1"
      />
      <PropertyRowItem
        icon={IoCalendarOutline}
        title="Tanggal Pembelian :"
        body="10/05/2022"
        className="mb-1"
      />
      <PropertyRowItem
        icon={HiOutlineLocationMarker}
        title="Lokasi :"
        body="Jalan Setia Budi,Tanjung Sari, Medan Selayang, Kota Medan, Provinsi Sumatera Utara"
        className="mb-6"
      />
      <PropertyRowItem
        icon={HiOutlineLocationMarker}
        title="Luas Tanah :"
        body={property.landArea.toString()}
        className="mb-1"
      />
      <PropertyRowItem
        icon={HiOutlineLocationMarker}
        title="Luas Bangunan :"
        body="-"
        className="mb-1"
      />
      <PropertyRowItem
        icon={HiOutlineLocationMarker}
        title="Nilai Tanah/meter :"
        body="Rp. 5.000.000,-"
        className="mb-1"
      />
      <PropertyRowItem
        icon={HiOutlineLocationMarker}
        title="Nilai Bangunan/meter :"
        body="Rp. 5.000.000,-"
        className="mb-1"
      />

      <div className="grid grid-cols-10 grid-rows-2 bg-[#FFEBBF] py-2  rounded-lg mb-10">
        <div className="col-span-2 row-span-2 items-center  flex justify-center">
          <HiOutlineLocationMarker className="text-gray-500" size={20} />
        </div>
        <div className="col-span-8 row-span-1 text-sm ">Total Nilai :</div>
        <div className="col-span-8 row-span-1 text-xs font-thin">
          Rp. 5.000.000.000,-
        </div>
      </div>

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
