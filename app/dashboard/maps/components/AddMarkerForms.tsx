import { IoClose } from "react-icons/io5";
import Dropdown from "../../../components/Dropdown";
import { useState } from "react";

import DropdownInput from "../../../components/DropdownInput";
import { AreaInput } from "../../../components/AreaInput";
import { addProperty } from "../../../services/dataManagement.service";
import Loading from "../../../components/Loading";
import { AddAssetValuationForm } from "./AddAssetValuationForm";
import { AddDataValuationForm } from "./AddDataValuationForm";
import { error } from "console";

// If the property is null, then it is on edit mode
// else it is on add mode, hence, the lat and lng always given
interface AddMarkerFormProps {
  onClose: () => void;
  onShowModalSuccess?: () => void;
  onShowModalFail?: () => void;
  lat?: number;
  lng?: number;
}

export const AddMarkerForm: React.FC<AddMarkerFormProps> = ({
  onClose,
  lat,
  lng,
  onShowModalSuccess,
  onShowModalFail,
}: AddMarkerFormProps) => {
  // New state for loading and modal
  const [isLoading, setIsLoading] = useState(false);

  const propertyTypes = ["Aset", "Data"];
  const objectTypes = ["Tanah Kosong", "Ruko/Rukan", "Rumah Tinggal"];

  const [selectedPropertyType, selectPropertyType] = useState<string>("Aset");
  const [selectedObjectType, selectObjectType] = useState<string>("");
  const [landArea, setlandArea] = useState<number>(0);
  const [debitur, setDebitur] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [buildingArea, setbuildingArea] = useState<number>(0);

  const [landValue, setLandValue] = useState<number>(0);
  const [buildingValue, setBuildingValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [valuationDate, setValuationDate] = useState<string>("");
  const [reportNumber, setReportNumber] = useState<string>("");
  const [appraiser, setAppraiser] = useState<string>("");

  const onChangePropertyType = (propertyType: string) => {
    selectPropertyType(propertyType);
    console.log("Selected option:", propertyType);
  };

  const onChangeObjectType = (objectType: string) => {
    selectObjectType(objectType);
    console.log("Selected option:", objectType);
  };

  const [errors, setErrors] = useState({
    propertyType: "",
    objectType: "",
    debitur: "",
    address: "",
    landArea: "",
    buildingArea: "",
    phoneNumber: "",
    landValue: "",
    buildingValue: "",
    totalValue: "",
    valuationDate: "",
    reportNumber: "",
    appraiser: "",
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
      landValue: "",
      buildingValue: "",
      totalValue: "",
      valuationDate: "",
      reportNumber: "",
      appraiser: "",
    };

    // Validate all inputs are not empty
    if (!selectedPropertyType) {
      newErrors.propertyType = "Property type is required.";
      isValid = false;
    }
    if (!selectedObjectType) {
      newErrors.objectType = "Object type is required.";
      isValid = false;
    }
    if (selectedPropertyType == "Aset" && !debitur) {
      newErrors.debitur = "Debitur is required.";
      isValid = false;
    }
    if (!address) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    if (isNaN(Number(landArea))) {
      newErrors.landArea = "Luas Tanah must be a number.";
      isValid = false;
    }

    if (isNaN(Number(buildingArea))) {
      newErrors.landArea = "Building area must be a number.";
      isValid = false;
    }
    if (selectedPropertyType == "Data" && !phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
      isValid = false;
    }
    if (selectedPropertyType == "Data" && isNaN(Number(phoneNumber))) {
      newErrors.phoneNumber = "Phone number must be between 10 and 15 digits.";
      isValid = false;
    }

    if (!valuationDate) {
      newErrors.valuationDate = "Tanggal penilaian is required.";
      isValid = false;
    }

    if (!reportNumber && selectedPropertyType == "Aset") {
      newErrors.reportNumber = "Nomor Laporan is required.";
      isValid = false;
    }

    if (!appraiser && selectedPropertyType == "Aset") {
      newErrors.appraiser = "Penilai is required.";
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
      await addProperty({
        latitude: lat!,
        longitude: lng!,
        address: address,
        objectType: selectedObjectType,
        landArea: landArea != null ? Number(landArea) : 0,
        buildingArea: buildingArea != null ? Number(buildingArea) : 0,
        phoneNumber: phoneNumber,
        propertiesType: selectedPropertyType.toLowerCase(),
        debitur: debitur,
        landValue: landValue ?? 0,
        buildingValue: buildingValue ?? 0,
        totalValue: totalValue ?? 0,
        appraiser: appraiser,
        reportNumber: reportNumber,
        valuationDate: valuationDate,
      });

      onClose();
      if (onShowModalSuccess != null) {
        onShowModalSuccess();
      }
    } catch (error) {
      console.error("Failed to update property with valuations:", error);
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
        <h3 className="text-xl font-medium">Add</h3>
      </div>

      <div className="px-12">
        <p className="text-2sm font-thin mb-2">Jenis Data :</p>
        <Dropdown
          placeholder="Jenis Data"
          options={propertyTypes}
          onChange={onChangePropertyType}
          initialValue={selectedPropertyType}
        />
        {errors.objectType && (
          <p className="text-red-500 text-xs">{errors.propertyType}</p>
        )}

        <p className="text-2sm font-thin mb-2 mt-5">Jenis Objek :</p>
        <DropdownInput
          placeholder="Jenis Objek"
          options={objectTypes}
          onChange={onChangeObjectType}
          initialValue={selectedObjectType}
        />
        {errors.objectType && (
          <p className="text-red-500 text-xs">{errors.objectType}</p>
        )}

        {selectedPropertyType == "Data" && (
          <>
            <p className="text-2sm font-thin mb-2 mt-5">Nomor HP :</p>
            <input
              value={phoneNumber}
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
              value={debitur}
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
          value={address}
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
          initialValue={landArea}
          onChange={(value) => {
            setlandArea(value);
          }}
        />
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address}</p>
        )}

        <p className="text-2sm font-thin mb-2 mt-5">Luas Bangunan :</p>
        <AreaInput
          initialValue={buildingArea}
          onChange={(value) => {
            setbuildingArea(value);
          }}
        />
        {errors.buildingArea && (
          <p className="text-red-500 text-xs">{errors.buildingArea}</p>
        )}

        {selectedPropertyType == "Aset" && (
          <AddAssetValuationForm
            assetValuationErrors={{
              appraiser: errors.appraiser,
              reportNumber: errors.reportNumber,
            }}
            errors={{
              landValue: errors.landValue,
              buildingValue: errors.buildingValue,
              totalValue: errors.totalValue,
              valuationDate: errors.valuationDate,
            }}
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
            onChangeAppraiser={(value) => {
              setAppraiser(value);
              console.log(`appraiser value = ${value}`);
            }}
          />
        )}

        {selectedPropertyType == "Data" && (
          <AddDataValuationForm
            errors={{
              landValue: errors.landValue,
              buildingValue: errors.buildingValue,
              totalValue: errors.totalValue,
              valuationDate: errors.valuationDate,
            }}
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
              handleSubmit();
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
