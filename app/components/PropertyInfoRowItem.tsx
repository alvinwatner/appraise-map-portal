import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

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
