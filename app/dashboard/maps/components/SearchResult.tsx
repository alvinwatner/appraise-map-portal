import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { IoIosMore } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";
import { PropertyChip, PropertyType } from "@/app/components/PropertyChip";

export const SearchResult: React.FC = () => {
  return (
    <div className="relative w-full z-10">
      <div className="flex justify-between items-center mb-4 px-12">
        <h3 className="text-lg font-medium">Results</h3>
        <div className="flex">
          {" "}
          <HiAdjustmentsHorizontal className="mr-2" />
          <p className="text-sm">Filter</p>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y divide-gray-400">
        <div className="py-1">
          <div className="grid grid-cols-8 h-32 mt-2 px-12 ">
            <div className="col-span-5  flex flex-col">
              <h3 className="text-xl mb-2">Tanah Kosong</h3>
              <PropertyChip type={PropertyType.DATA} className="mb-2" />
              <p className="text-[10px] leading-relaxed">
                Jalan Setia Budi,Tanjung Sari, Medan Selayang, Kota Medan,
                Provinsi Sumatera Utara
              </p>
            </div>
            <div className="col-span-2 flex flex-col"></div>
            <div className="col-span-1 flex flex-col justify-around">
              <div className="flex flex-col justify-center items-center">
                <div
                  className="rounded-full w-6 h-6 flex items-center justify-center bg-white ring-1 ring-black hover:ring-1 hover:ring-c-blue transition duration-100 p-1 mb-1"
                  onClick={() => {}}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  <IoIosMore size={20} />
                </div>
                <p className="text-[8px] mb-2">Detail</p>
              </div>

              <div className="flex flex-col justify-center items-center">
                <div
                  className="rounded-full w-6 h-6 flex items-center justify-center bg-white ring-1 ring-black hover:ring-1 hover:ring-c-blue transition duration-100 p-1 mb-1"
                  onClick={() => {}}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  <GoArrowRight size={20} />
                </div>
                <p className="text-[8px] ">Go</p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-1">
          <div className="grid grid-cols-8 h-32 mt-2 px-12 ">
            <div className="col-span-5  flex flex-col">
              <h3 className="text-xl mb-2">Tanah Kosong</h3>
              <PropertyChip type={PropertyType.ASSET} className="mb-2" />
              <p className="text-[10px] leading-relaxed">
                Jalan Setia Budi,Tanjung Sari, Medan Selayang, Kota Medan,
                Provinsi Sumatera Utara
              </p>
            </div>
            <div className="col-span-2 flex flex-col"></div>
            <div className="col-span-1 flex flex-col justify-around">
              <div className="flex flex-col justify-center items-center">
                <div
                  className="rounded-full w-6 h-6 flex items-center justify-center bg-white ring-1 ring-black hover:ring-1 hover:ring-c-blue transition duration-100 p-1 mb-1"
                  onClick={() => {}}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  <IoIosMore size={20} />
                </div>
                <p className="text-[8px] mb-2">Detail</p>
              </div>

              <div className="flex flex-col justify-center items-center">
                <div
                  className="rounded-full w-6 h-6 flex items-center justify-center bg-white ring-1 ring-black hover:ring-1 hover:ring-c-blue transition duration-100 p-1 mb-1"
                  onClick={() => {}}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  <GoArrowRight size={20} />
                </div>
                <p className="text-[8px] ">Go</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=""></div>
    </div>
  );
};
