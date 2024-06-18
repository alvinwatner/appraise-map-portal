import Head from "next/head";

import { IconType } from "react-icons";
import { FaRegCopy } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import copy from 'clipboard-copy';
import useSnackbar from "../lib/hooks/useSnackbar";
import { FaCheck } from "react-icons/fa";


interface PropertyRowItemProps {
  icon: IconType;
  title: string;
  body: string;
  className?: string;
}

export const PropertyRowItem: React.FC<PropertyRowItemProps> = ({
  icon: Icon,
  title,
  body,
  className,
}: PropertyRowItemProps) => {
  return (
    <div className={twMerge(` grid grid-cols-12 grid-rows-3`, className)}>
      <div className=" col-span-2 row-span-2 items-center  flex justify-start">
        <Icon className="text-gray-500" size={24} />
      </div>
      <div className=" col-span-10 row-span-1 text-sm "> {title}</div>
      <div className="col-span-10 row-span-3 text-xs font-thin"> {body}</div>
    </div>
  );
};

export const PropertyRowItemWithIcon: React.FC<PropertyRowItemProps> = ({
  icon: Icon,
  title,
  body,
  className,
}: PropertyRowItemProps) => {
  const addSnackbar = useSnackbar();


  const handleCopyClick = async () => {
    try {
      await copy(body);
      addSnackbar({
        key: "success",
        text: "This is a success snackbar",
        variant: "success",
        icon: FaCheck
      });
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
    }
  };

  return (
    <div className={twMerge(`grid grid-cols-12 grid-rows-3`, className)}>
      <div className="col-span-2 row-span-2 items-center flex justify-start">
        <Icon className="text-gray-500" size={24} />
      </div>
      <div className="col-span-10 row-span-1 text-sm"> {title}</div>
      <div className="col-span-4 row-span-3 text-xs font-thin"> {body}</div>
      <div className="col-span-6 row-span-3 flex  items-start justify-start">
        <button className="" onClick={handleCopyClick}>
          <FaRegCopy className="text-gray-500" size={18} />
        </button>
      </div>
    </div>
  );
};
