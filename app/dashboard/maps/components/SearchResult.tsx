import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { TbDatabaseX } from "react-icons/tb";
import { IoIosMore } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";
import { PropertyChip, PropertyType } from "@/app/components/PropertyChip";
import { Property } from "@/app/types/types";
import { fetchProperties } from "@/app/services/dataManagement.service";
import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";

export const SearchResult: React.FC<{
  query: string;
  onDetailClicked: (property: Property) => void;
}> = ({ query, onDetailClicked }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("loading properties");
    const loadProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchProperties(query);
        setProperties(response.data); // Assuming response is structured as { data: Property[] }
      } catch (err) {
        setError("Failed to fetch properties");
        console.error(err); // Logging the error might be useful for debugging
      } finally {
        console.log("finally capung get executed");
        setIsLoading(false);
      }
    };

    if (query) {
      console.log("is load proprerties ");
      loadProperties();
    }
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Loading size="w-16 h-16" strokeWidth="border-8 border-t-8" />
      </div>
    );
  }

  if (error) {
    // return <div>Error: {error}</div>;
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TbDatabaseX className="mb-4" size={30} />
        <div className="text-center  text-gray-500">
          Maaf, terjadi kegagalan server.
        </div>
        <div className="text-center  text-gray-400 text-sm">
          Maaf, terjadi kegagalan server.
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TbDatabaseX className="mb-4" size={30} />
        <div className="text-center  text-gray-500">
          Maaf, tidak menemukan data.
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full z-10">
      <div className="sticky top-0 z-50 bg-white px-12 py-4 shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Results</h3>
          <div className="flex">
            <HiAdjustmentsHorizontal className="mr-2" />
            <p className="text-sm">Filter</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y divide-gray-400">
        {properties.map((property) => (
          <SearchResultItem
            key={property.id}
            property={property}
            onDetailClicked={onDetailClicked}
          />
        ))}
      </div>

      <div className=""></div>
    </div>
  );
};

const SearchResultItem: React.FC<{
  property: Property;
  onDetailClicked: (property: Property) => void;
}> = ({ property, onDetailClicked }) => {
  return (
    <div className="py-4">
      <div className="grid grid-cols-8 h-32 mt-2 px-12 ">
        <div className="col-span-5  flex flex-col">
          <h3 className="text-xl mb-2">{property.objectType}</h3>

          {property.propertiesType == "aset" ? (
            <PropertyChip type={PropertyType.ASSET} className="mb-2" />
          ) : (
            <PropertyChip type={PropertyType.DATA} className="mb-2" />
          )}
          <p className="text-[10px] leading-relaxed">
            {property.locations.address}
          </p>
        </div>
        <div className="col-span-2 flex flex-col"></div>
        <div className="col-span-1 flex flex-col justify-around">
          <div className="flex flex-col justify-center items-center">
            <div
              className="rounded-full w-6 h-6 flex items-center justify-center bg-white ring-1 ring-black hover:ring-1 hover:ring-c-blue transition duration-100 p-1 mb-1"
              onClick={() => {
                onDetailClicked(property);
              }}
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
  );
};
