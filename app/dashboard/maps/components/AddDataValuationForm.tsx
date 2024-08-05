import React, { useEffect, useState } from "react";
import { fetchUserDataSession } from "@/app/services/dataManagement.service";
import {
  BaseAddValuationForm,
  BaseAddValuationFormProps,
} from "./BaseValuationForm";

interface AddDataValuationFormProps extends BaseAddValuationFormProps {}

export const AddDataValuationForm: React.FC<AddDataValuationFormProps> = ({
  onChangeLandValue,
  onChangeBuildingValue,
  onChangeTotalValue,
  onChangeValuationDate,
  errors,
}: AddDataValuationFormProps) => {
  return (
    <div>
      <BaseAddValuationForm
        errors={errors}
        onChangeLandValue={onChangeLandValue}
        onChangeBuildingValue={onChangeBuildingValue}
        onChangeTotalValue={onChangeTotalValue}
        onChangeValuationDate={onChangeValuationDate}
      />
    </div>
  );
};
