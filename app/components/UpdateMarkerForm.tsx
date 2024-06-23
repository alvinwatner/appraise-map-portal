import {
  IoCheckmarkCircleOutline,
  IoClose,
  IoCloseCircleOutline,
} from "react-icons/io5";
import Dropdown from "./Dropdown";
import { useState } from "react";
import { AsetValuationForm } from "./AssetValuationForm";
import { DataValuationForms } from "./DataValuationForm";

import DropdownInput from "./DropdownInput";
import { AreaInput } from "./AreaInput";
import { Property, Location, Valuation } from "../types/types";
import { PropertyType } from "./PropertyChip";
import { capitalizeFirstLetter } from "@/app/utils/helper";
import { addProperty } from "../services/dataManagement.service";
import Loading from "./Loading";

// If the property is null, then it is on edit mode
// else it is on add mode, hence, the lat and lng always given
interface UpdateMarkerFormProps {
  onClose: () => void;
  onShowModalSuccess?: () => void;
  onShowModalFail?: () => void;
  property?: Property;
  lat?: number;
  lng?: number;
}

export const UpdateMarkerForm: React.FC<UpdateMarkerFormProps> = ({
  onClose,
  property,
  lat,
  lng,
  onShowModalSuccess,
  onShowModalFail,
}: UpdateMarkerFormProps) => {
  const [valuations, setValuations] = useState<Valuation[]>(
    property ? property.valuations : []
  );

  // New state for loading and modal
  const [isLoading, setIsLoading] = useState(false);

  const updateValuation = (index: number, updatedValuation: Valuation) => {
    console.log(`Updating valuation at index ${index}`);
    console.log("Current valuation:", valuations[index]);
    console.log("Updated valuation:", updatedValuation);
    const newValuations = [...valuations];
    newValuations[index] = updatedValuation;
    setValuations(newValuations);
  };

  const propertyTypes = ["Aset", "Data"];
  const objectTypes = ["Tanah Kosong", "Ruko/Rukan", "Rumah Tinggal"];

  const [selectedPropertyType, selectPropertyType] = useState<string>(
    property != null ? property?.propertiesType : "Aset"
  );
  const [selectedObjectType, selectObjectType] = useState<string>("");
  const [landArea, setlandArea] = useState<string>("");
  const [debitur, setDebitur] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [buildingArea, setbuildingArea] = useState<string>("");

  const [landValue, setLandValue] = useState<number>(0);
  const [buildingValue, setBuildingValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [valuationDate, setValuationDate] = useState<string>("");
  const [reportNumber, setReportNumber] = useState<string>("");

  const onChangePropertyType = (propertyType: string) => {
    selectPropertyType(propertyType);
    console.log("Selected option:", propertyType);
  };

  const onChangeObjectType = (objectType: string) => {
    selectObjectType(objectType);
    console.log("Selected option:", objectType);
  };

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
    if (!debitur) {
      newErrors.debitur = "Debitur is required.";
      isValid = false;
    }
    if (!address) {
      newErrors.address = "Address is required.";
      isValid = false;
    }
    if (!landArea || isNaN(Number(landArea))) {
      newErrors.landArea = "Luas Tanah must be a number.";
      isValid = false;
    }
    if (!buildingArea || isNaN(Number(buildingArea))) {
      newErrors.buildingArea = "Luas Bangunan must be a number.";
      isValid = false;
    }
    if (
      selectedPropertyType == "Data" &&
      (!phoneNumber ||
        isNaN(Number(phoneNumber)) ||
        phoneNumber.length < 10 ||
        phoneNumber.length > 15)
    ) {
      newErrors.phoneNumber = "Phone number must be between 10 and 15 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      alert("Please correct the errors in the form.");
      return;
    }

    setIsLoading(true);

    // If validation passes
    try {
      const response = await addProperty({
        latitude: lat!,
        longitude: lng!,
        address: address,
        objectType: selectedObjectType,
        landArea: Number(landArea),
        buildingArea: Number(buildingArea),
        phoneNumber: phoneNumber,
        propertiesType: selectedPropertyType.toLowerCase(),
        debitur: debitur,
        landValue: landValue,
        buildingValue: buildingValue,
        totalValue: totalValue,
        reportNumber: reportNumber,
        valuationDate: valuationDate,
      });
      console.log(response);
      onClose(); // Close form on success
      if (onShowModalSuccess != null) {
        onShowModalSuccess();
      }
    } catch (error) {
      console.error("Failed to add property with valuations:", error);
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
              value={property != null ? property.phoneNumber : phoneNumber}
              className="w-full pl-2 py-2 rounded-lg placeholder: placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
              type="text"
              onChange={(event) => {
                setPhoneNumber(event.target.value);
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
              value={property != null ? property.debitur : debitur}
              className="w-full pl-2 py-2 rounded-lg placeholder: placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
              type="text"
              onChange={(event) => {
                console.log("Input changed: ", event.target.value);
                setDebitur(event.target.value);
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
          value={property != null ? property.locations.address : address}
          className="w-full pl-2 py-2 h-20 rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm resize-none"
          rows={4}
          onChange={(event) => {
            setAddress(event.target.value);
          }}
          placeholder="Alamat"
        ></textarea>
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address}</p>
        )}

        <p className="text-2sm font-thin mb-2 mt-2">Luas Tanah :</p>
        <AreaInput
          initialValue={property != null ? property.landArea?.toString() : ""}
          onChange={(value) => {
            setlandArea(value);
          }}
        />
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address}</p>
        )}

        <p className="text-2sm font-thin mb-2 mt-5">Luas Bangunan :</p>
        <AreaInput
          initialValue={
            property != null ? property.buildingArea?.toString() : buildingArea
          }
          onChange={(value) => {
            setbuildingArea(value);
          }}
        />
        {errors.buildingArea && (
          <p className="text-red-500 text-xs">{errors.buildingArea}</p>
        )}

        {selectedPropertyType == "Aset" ? (
          <AsetValuationForm
            onChangeLandValue={(value) => {
              setLandValue(value);
            }}
            onChangeBuildingValue={(value) => {
              setBuildingValue(value);
            }}
            onChangeTotalValue={(value) => {
              setTotalValue(value);
            }}
            onChangeValuationDate={(value) => {
              setValuationDate(value);
            }}
            onChangeReportNumber={(value) => {
              setReportNumber(value);
            }}
          />
        ) : (
          // <AssetValuationForms
          //   valuations={property?.valuations ?? []}
          //   isEdit={property != null}
          //   onUpdateValuation={updateValuation}
          // />
          <DataValuationForms
            valuations={property?.valuations ?? []}
            isEdit={property != null}
          />
        )}

        <div className="grid grid-cols-2 gap-2 mb-10 mt-8">
          <button
            className="flex items-center justify-center  col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex items-center justify-center col-span-1 bg-[#5EABEE] hover:bg-blue-700 text-white font-bold py-2 rounded"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loading size="w-4 h-4" strokeWidth="border-2 border-t-2" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
