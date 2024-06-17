import { useState, useRef, useEffect } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

interface DropdownProps {
  placeholder: string;
  options: string[];
  onChange: (selectedOption: string) => void;
  initialValue?: string;
}

const DropdownInput: React.FC<DropdownProps> = ({ placeholder, options, onChange, initialValue = ""}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChange(value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center ring-2 ring-[#D9D9D9] rounded-lg">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={toggleDropdown}
          placeholder={placeholder}
          className="w-full pl-2 py-2 text-left text-sm rounded-lg outline-none"
        />
        <TiArrowSortedDown size={15} className="mr-2 text-gray-400 cursor-pointer" onClick={toggleDropdown} />
      </div>
      {isOpen && (
        <ul className="absolute top-10 shadow-md bg-white py-1 text-black rounded w-full z-10">
          {options.filter(option => option.toLowerCase().includes(inputValue.toLowerCase())).map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownInput;
