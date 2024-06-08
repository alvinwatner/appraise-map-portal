import { IoClose } from "react-icons/io5";
import Dropdown from "./Dropdown";
import { useState } from "react";
import { AssetValuationForm } from "./AssetValuationForm";
import { DataValuationForm } from "./DataValuationForm";
import { TbMeterSquare } from "react-icons/tb";

import DropdownInput from "./DropdownInput";
import { AreaInput } from "./AreaInput";

interface AddMarkerFormProps {
  onClose: () => void;
}

export const AddMarkerForm: React.FC<AddMarkerFormProps> = ({
  onClose,
}: AddMarkerFormProps) => {
  const propertyTypes = ["Aset", "Pembanding"];
  const objectTypes = ["Tanah Kosong", "Ruko/Rukan", "Rumah Tinggal"];

  const [selectedProperty, selectProperty] = useState<string>("");
  const [selectedObjectType, selectObjectType] = useState<string>("");
  const [luasTanah, setLuasTanah] = useState<string>("");
  const [luasBangunan, setLuasBangunan] = useState<string>("");

  const onChangePropertyType = (propertyType: string) => {
    selectProperty(propertyType);
    console.log("Selected option:", propertyType);
  };

  const onChangeObjectType = (objectType: string) => {
    selectObjectType(objectType);
    console.log("Selected option:", objectType);
  };

  return (
    <div className="relative w-full z-10 px-12 ">
      <button onClick={onClose}>
        <IoClose
          className="absolute right-5 top-6 z-0 "
          color="grey"
          size={25}
        />
      </button>

      <h3 className="text-xl font-medium mb-8">Add</h3>

      <p className="text-2sm font-thin mb-2">Jenis Data :</p>
      <Dropdown
        placeholder="Jenis Objek"
        options={propertyTypes}
        onChange={onChangePropertyType}
      />

      <p className="text-2sm font-thin mb-2 mt-5">Jenis Objek :</p>
      <DropdownInput
        placeholder="Jenis Objek"
        options={objectTypes}
        onChange={onChangeObjectType}
      />

      <p className="text-2sm font-thin mb-2 mt-5">Nama Debitur :</p>
      <input
        className="w-full pl-2 py-2 rounded-lg placeholder: placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
        type="text"
        placeholder="Nama Debitur"
      />

      <p className="text-2sm font-thin mb-2 mt-5">Alamat:</p>
      <textarea
        className="w-full pl-2 py-2 h-20 rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm resize-none"
        rows={4}
        placeholder="Nama Debitur"
      ></textarea>

      <p className="text-2sm font-thin mb-2 mt-2">Luas Tanah :</p>
      <AreaInput
        onChange={(value) => {
          setLuasTanah(value);
        }}
      />
    

      <p className="text-2sm font-thin mb-2 mt-5">Luas Bangunan :</p>
      <AreaInput
        onChange={(value) => {
          setLuasBangunan(value);
        }}
      />

      {selectedProperty == "Aset" ? (
        <AssetValuationForm />
      ) : (
        <DataValuationForm />
      )}

      <div className="grid grid-cols-2 gap-2 mb-10 mt-8">
        <button className="flex items-center justify-center  col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Cancel
        </button>
        <button className="flex items-center justify-center col-span-1 bg-[#5EABEE] hover:bg-blue-700 text-white font-bold py-2  rounded">
          Submit
        </button>
      </div>
    </div>
  );
};
