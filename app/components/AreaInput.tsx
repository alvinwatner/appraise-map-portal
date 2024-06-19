import { useState } from "react";
import { TbMeterSquare } from "react-icons/tb";
import { filterNumeric } from "../utils/helper";

interface AreaInputProps{
  onChange: (value: string) => void;
  initialValue?: string;
}

export const AreaInput: React.FC<AreaInputProps> = ({onChange, initialValue = ""} : AreaInputProps) => {
  const [value, setValue] = useState<string>(initialValue);
 
  return (
    <div className="relative">
    <div className="flex items-center ring-2 ring-[#D9D9D9] rounded-lg">
      <input
        className="w-full pl-2 py-2 text-left text-sm rounded-lg outline-none"
        type="text"
        placeholder="102"
        value={value}
        onChange={(event) => {
           setValue(filterNumeric(event.target.value));
           onChange(value);
        }}
      />
      <TbMeterSquare size={25} className="mr-2 text-gray-400 " />
    </div>
  </div>
  );
}