import { useState } from "react";
import { TbMeterSquare } from "react-icons/tb";

interface AreaInputProps{
  onChange: (value: string) => void;
}

export const AreaInput: React.FC<AreaInputProps> = ({onChange} : AreaInputProps) => {
  const [value, setValue] = useState<string>("");

  const formatLuasValue = (inputValue: string) => {
    // Strip out non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    // Append 'm2' if there is a numeric value
    return numericValue;
  };  
  return (
    <div className="relative">
    <div className="flex items-center ring-2 ring-[#D9D9D9] rounded-lg">
      <input
        className="w-full pl-2 py-2 text-left text-sm rounded-lg outline-none"
        type="text"
        placeholder="102"
        value={value}
        onChange={(event) => {
           setValue(formatLuasValue(event.target.value));
           onChange(value);
        }}
      />
      <TbMeterSquare size={25} className="mr-2 text-gray-400 " />
    </div>
  </div>
  );
}