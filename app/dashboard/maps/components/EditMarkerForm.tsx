import { IoClose } from "react-icons/io5";
import Dropdown from "../../../components/Dropdown";
import { useEffect, useState } from "react";

import DropdownInput from "../../../components/DropdownInput";
import { AreaInput } from "../../../components/AreaInput";
import { Property, Location, Valuation } from "../../../types/types";
import { PropertyType } from "../../../components/PropertyChip";
import { capitalizeFirstLetter } from "@/app/utils/helper";
import {
  addProperty,
  addValuations,
  updateProperty,
  updateValuation,
} from "../../../services/dataManagement.service";
import Loading from "../../../components/Loading";
import { EditAssetValuationForms } from "./EditAssetValuationForms";
import { EditDataValuationForms } from "./EditDataValuationForms";

// If the property is null, then it is on edit mode
// else it is on add mode, hence, the lat and lng always given
interface EditMarkerFormProps {
  onClose: () => void;
  onShowModalSuccess?: () => void;
  onShowModalFail?: () => void;
  property: Property;
  lat?: number;
  lng?: number;
}

export const EditMarkerForm: React.FC<EditMarkerFormProps> = ({
  onClose,
  property,
  lat,
  lng,
  onShowModalSuccess,
  onShowModalFail,
}: EditMarkerFormProps) => {
  const [newValuations, setNewValuations] = useState<Valuation[]>([]);

  const [editedProperty, setEditedProperty] = useState<Partial<Property>>({
    id: property.id,
  });

  const [editedValuations, setEditedValuations] = useState<
    Map<number, Partial<Valuation>>
  >(new Map());

  // New state for loading and modal
  const [isLoading, setIsLoading] = useState(false);

  const propertyTypes = ["Aset", "Data"];
  const objectTypes = ["Tanah Kosong", "Ruko/Rukan", "Rumah Tinggal"];

  const [selectedPropertyType, selectPropertyType] = useState<string>(
    capitalizeFirstLetter(property?.propertiesType)
  );
  const [selectedObjectType, selectObjectType] = useState<string>(
    property.objectType
  );

  const onChangePropertyType = (propertyType: string) => {
    selectPropertyType(propertyType);
    console.log("Selected option:", propertyType);
  };

  const onChangeObjectType = (objectType: string) => {
    handleOnChangeProperty("objectType", objectType);
    selectObjectType(objectType);
    console.log("Selected option:", objectType);
  };

  const handleOnChangeProperty = (field: keyof Property, value: any) => {
    setEditedProperty((prev) => {
      return { ...prev, [field]: value };
    });
  };

  const onChangeValuations = (
    id: number,
    field: keyof Valuation,
    value: any
  ) => {
    console.log(
      "Existing valuations on change id: " +
        id +
        " field: " +
        field +
        " value: " +
        value
    );

    setEditedValuations((prevMap) => {
      const updatedMap = new Map(prevMap); // Create a new map for immutability
      const existingValuation = updatedMap.get(id) || {};

      updatedMap.set(id, { ...existingValuation, [field]: value });
      return updatedMap;
    });
  };

  useEffect(() => {
    console.log("All valuations on change = " + JSON.stringify(newValuations));
  }, [newValuations]);

  useEffect(() => {
    console.log(
      "Updated Edited Valuations:",
      JSON.stringify(Array.from(editedValuations.entries()))
    );
  }, [editedValuations]); // Dependency array includes editedValuations

  const [errors, setErrors] = useState({
    debitur: "",
    address: "",
    landArea: "",
    buildingArea: "",
    phoneNumber: "",
  });

  const validateInputs = () => {
    let isValid = true;
    let newErrors = {
      propertyType: "",
      objectType: "",
      debitur: "",
      address: "",
      landArea: "",
      buildingArea: "",
      phoneNumber: "",
    };

    // Validate all inputs are not empty
    if (!selectedPropertyType) {
      newErrors.debitur = "Property type is required.";
      isValid = false;
    }
    if (!selectedObjectType) {
      newErrors.debitur = "Object type is required.";
      isValid = false;
    }
    if ("debitur" in editedProperty && !editedProperty.debitur) {
      newErrors.debitur = "Debitur is required.";
      isValid = false;
    }
    if (
      "locations" in editedProperty &&
      editedProperty.locations !== undefined &&
      "address" in editedProperty.locations &&
      !editedProperty.locations.address
    ) {
      newErrors.address = "Address is required.";
      isValid = false;
    }
    if (
      "landArea" in editedProperty &&
      !editedProperty.landArea &&
      isNaN(Number(editedProperty.landArea))
    ) {
      newErrors.landArea = "Luas Tanah must be a number.";
      isValid = false;
    }
    if (
      "buildingArea" in editedProperty &&
      !editedProperty.buildingArea &&
      isNaN(Number(editedProperty.buildingArea))
    ) {
      console.log(
        `editedProperty.buildingArea ${
          "buildingArea" in editedProperty && !editedProperty.buildingArea
        } isNaN(Number(editedProperty.buildingArea) ${isNaN(
          Number(editedProperty.buildingArea)
        )}`
      );
      console.log("building area value " + editedProperty.buildingArea);
      newErrors.buildingArea = "Luas Bangunan must be a number.";
      isValid = false;
    }
    if (
      selectedPropertyType == "Data" &&
      "phoneNumber" in editedProperty &&
      !editedProperty.phoneNumber &&
      editedProperty.phoneNumber !== undefined &&
      (isNaN(Number(editedProperty.phoneNumber)) ||
        editedProperty.phoneNumber.length < 10 ||
        editedProperty.phoneNumber.length > 15)
    ) {
      newErrors.phoneNumber = "Phone number must be between 10 and 15 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      alert("Please correct the errors in the form.");
      return;
    }

    setIsLoading(true);

    // If validation passes
    try {
      updateProperty(property.id, editedProperty);

      for (const [id, changes] of Array.from(editedValuations.entries())) {
        await updateValuation(id, changes);
      }

      if (newValuations.length > 0) {
        addValuations(newValuations);
      }

      onClose(); // Close form on success
      if (onShowModalSuccess != null) {
        onShowModalSuccess();
      }
    } catch (error) {
      console.error("Failed to update property", error);
      if (onShowModalFail != null) {
        onShowModalFail();
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="relative w-full z-10 ">
      <div className="sticky flex p-4  justify-between flex-row-reverse top-0 bg-white z-20  border-b-[2px] border-gray-400 mb-5 px-12">
        <button onClick={onClose}>
          <IoClose className="" color="grey" size={25} />
        </button>
        <h3 className="text-xl font-medium">
          {property != null ? "Edit" : "Add"}
        </h3>
      </div>

      <div className="px-12">
        <p className="text-2sm font-thin mb-2">Jenis Data :</p>
        <Dropdown
          placeholder="Jenis Data"
          options={propertyTypes}
          onChange={onChangePropertyType}
          initialValue={capitalizeFirstLetter(
            property?.propertiesType ?? "Aset"
          )}
        />

        <p className="text-2sm font-thin mb-2 mt-5">Jenis Objek :</p>
        <DropdownInput
          placeholder="Jenis Objek"
          options={objectTypes}
          onChange={onChangeObjectType}
          initialValue={property?.objectType}
        />

        {selectedPropertyType == "Data" && (
          <>
            <p className="text-2sm font-thin mb-2 mt-5">Nomor HP :</p>
            <input
              value={property.phoneNumber}
              className="w-full pl-2 py-2 rounded-lg placeholder: placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
              type="text"
              onChange={(event) => {
                handleOnChangeProperty("phoneNumber", event.target.value);
              }}
              placeholder="Nomor HP"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
            )}
          </>
        )}

        {selectedPropertyType == "Aset" && (
          <>
            <p className="text-2sm font-thin mb-2 mt-5">Nama Debitur :</p>
            <input
              value={property.debitur}
              className="w-full pl-2 py-2 rounded-lg placeholder: placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
              type="text"
              onChange={(event) => {
                handleOnChangeProperty("debitur", event.target.value);
              }}
              placeholder="Nama Debitur"
            />
            {errors.debitur && (
              <p className="text-red-500 text-xs">{errors.debitur}</p>
            )}
          </>
        )}
        <p className="text-2sm font-thin mb-2 mt-5">Alamat:</p>
        <textarea
          value={property.locations.address}
          className="w-full pl-2 py-2 h-20 rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm resize-none"
          rows={4}
          onChange={(event) => {
            handleOnChangeProperty("locations", {
              ...editedProperty.locations,
              address: event.target.value,
            });
            handleOnChangeProperty("landArea", event.target.value);
          }}
          placeholder="Alamat"
        ></textarea>
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address}</p>
        )}

        <p className="text-2sm font-thin mb-2 mt-2">Luas Tanah :</p>
        <AreaInput
          initialValue={property.landArea}
          onChange={(value) => {
            handleOnChangeProperty("landArea", value);
          }}
        />
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.landArea}</p>
        )}

        <p className="text-2sm font-thin mb-2 mt-5">Luas Bangunan :</p>
        <AreaInput
          initialValue={property.buildingArea}
          onChange={(value) => {
            handleOnChangeProperty("buildingArea", value);
          }}
        />
        {errors.buildingArea && (
          <p className="text-red-500 text-xs">{errors.buildingArea}</p>
        )}

        {selectedPropertyType == "Aset" ? (
          <EditAssetValuationForms
            propertyId={property.id}
            valuations={property.valuations}
            onChangeValuations={onChangeValuations}
            onChangeNewValuations={(newValuations) => {
              setNewValuations(newValuations);
            }}
          />
        ) : (
          <EditDataValuationForms
            propertyId={property.id}
            valuations={property.valuations}
            onChangeValuations={onChangeValuations}
            onChangeNewValuations={(newValuations) => {
              setNewValuations(newValuations);
            }}
          />
        )}

        <div className="grid grid-cols-2 gap-2 mb-10 mt-8">
          <button
            className="flex items-center justify-center  col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="flex items-center justify-center col-span-1 bg-[#5EABEE] hover:bg-blue-700 text-white font-bold py-2 rounded"
            onClick={() => {
              handleSave();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loading size="w-4 h-4" strokeWidth="border-2 border-t-2" />
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
