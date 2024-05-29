import { useState, useRef, useEffect } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

interface DropdownProps {
  placeholder: string;
  options: string[]; // Assuming options are an array of strings
  onChange: (selectedOption: string) => void; // Function type specifying it takes a string and returns void
}

const Dropdown: React.FC<DropdownProps> = ({ placeholder, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(""); // Define state with a default type
  const dropdownRef = useRef<HTMLDivElement>(null);  // Ref for the dropdown container

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add when the dropdown is opened and cleanup when closed or component unmounts
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);  // Effect runs only when `isOpen` changes



  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    // Explicitly define the type of `option`
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className=" w-full pl-2 py-2 rounded-lg text-left ring-2 ring-[#D9D9D9] text-sm"
      >
        <span className="text-gray-400">{selectedOption || placeholder}</span>
        <TiArrowSortedDown size={15} className="absolute right-2 top-3 text-gray-400" />
      </button>
      {isOpen && (
        <ul className="absolute top-10 shadow-md bg-white py-1 text-black rounded w-full z-10">
          {options.map((option, index) => (
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

export default Dropdown;
