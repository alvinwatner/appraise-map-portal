import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export const ValuationCardAsset: React.FC = () => {
  return (
    <div className="relative flex flex-col bg-[#FFEBBF] py-2 pl-3 rounded-lg mb-10 shadow-lg">
      <p className="text-base mb-1">Rp. 5.000.000.000,-</p>
      <button className="">
        <MdOutlineKeyboardArrowDown
          size={20}
          className="absolute mr-4 z-10 top-2 right-0 "
        />
      </button>

      <p className="text-2sm mb-1 font-medium">20 April 2022 (Kevin)</p>
      <p className="text-2sm mb-1 font-thin font-100 italic tracking-wide">
        {" "}
        00240/2.0113-02/PI/07/0518/1/V/2023
      </p>
    </div>
  );
};
