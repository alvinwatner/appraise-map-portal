import { twMerge } from "tailwind-merge";

type PropertyTypeKey = "ASSET" | "DATA";

type PropertyTypeInfo = {
  value: PropertyTypeKey;
  toColor: () => string;
  toText: () => string;
};

export const PropertyType: Record<PropertyTypeKey, PropertyTypeInfo> = {
  ASSET: {
    value: "ASSET",
    toColor: () => "bg-red-600",
    toText: () => "Aset",
  },
  DATA: {
    value: "DATA",
    toColor: () => "bg-c-blue",
    toText: () => "Data",
  },
};


interface PropertyChipProps {
  type: PropertyTypeInfo;
  className?: string;
}

export const PropertyChip: React.FC<PropertyChipProps> = ({
  type,
  className = "",
}) => {
  return (
    <div
      className={twMerge(
        `p-2 w-12 h-6 ${type.toColor()} rounded-xl ring-1 ring-gray-400 flex items-center justify-center`,
        className
      )}
    >
      <p className="text-xs text-white">{type.toText()}</p>
    </div>
  );
};
