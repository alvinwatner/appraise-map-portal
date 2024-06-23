import { supabase } from "./../lib/supabaseClient";
import { Property, Valuation, Location } from "./../types/types";
import { PostgrestError, PostgrestResponse } from "@supabase/supabase-js";

export const fetchProperties = async (
  search: string = "",
  page: number = 1,
  perPage: number = 10,
  filters: any = {}
): Promise<{ data: Property[]; total: number }> => {
  let query = supabase
    .from("properties")
    .select(
      `
      id,
      debitur,
      landArea,
      buildingArea,
      phoneNumber,
      propertiesType,
      isDeleted,
      objectType,
      users (
        id,
        email,
        username,
        lastLogin,
        isActive
      ),
      locations (
        id,
        latitude,
        longitude,
        address
      ),
      valuations (
        id,
        valuationDate,
        landValue,
        buildingValue,
        totalValue,
        reportNumber,
        appraiser
      )
    `,
      { count: "exact" }
    )
    .is("isDeleted", null)
    .order("id", { ascending: true });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (filters.propertyType) {
    query = query.eq("propertiesType", filters.propertyType);
  }

  if (filters.valuationDate) {
    query = query.eq("valuations.valuationDate", filters.valuationDate);
  }

  if (filters.minTotalValue !== undefined) {
    query = query.gte("valuations.totalValue", filters.minTotalValue);
  }

  if (filters.maxTotalValue !== undefined) {
    query = query.lte("valuations.totalValue", filters.maxTotalValue);
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
    return { data: [], total: 0 };
  }

  return { data: data as unknown as Property[], total: count || 0 };
};

export const updatePropertiesIsDeleted = async (
  ids: number[],
  isDeleted: boolean
) => {
  const { data, error } = await supabase
    .from("properties")
    .update({ isDeleted })
    .in("id", ids);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateProperty = async (
  id: number,
  changes: Partial<Property>
) => {
  const { data, error } = await supabase
    .from("properties")
    .update(changes)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

interface AddPropertyArgs {
  latitude: number;
  longitude: number;
  address: string;
  objectType: string;
  landArea: number;
  buildingArea: number;
  phoneNumber: string;
  propertiesType: string;
  debitur: string;
  landValue: number;
  buildingValue: number;
  totalValue: number;
  reportNumber?: string | null;
  valuationDate?: string | null;
}

export const addProperty = async ({
  latitude,
  longitude,
  address,
  objectType,
  landArea,
  buildingArea,
  phoneNumber,
  propertiesType,
  debitur,
  landValue,
  buildingValue,
  totalValue,
  reportNumber,
  valuationDate,
}: AddPropertyArgs) => {
  // Insert new location
  const { data: locationData, error: locationError } = await supabase
    .from("locations")
    .insert({
      latitude: latitude,
      longitude: longitude,
      address: address,
    }).select();

  console.log("response add location = " + locationData);

  if (locationError) {
    throw new Error(`Error adding location: ${locationError.message}`);
  }

  if (locationData == null) {
    throw new Error("Location data is null or empty");
  }

  const locationId = (locationData[0] as Location).id;

  // Insert the property
  const { data: propertyData, error: propertyError } = await supabase
    .from("properties") // No type argument here
    .insert([
      {
        UserId: 3,
        LocationId: locationId,
        objectType: objectType,
        landArea: landArea,
        buildingArea: buildingArea,
        phoneNumber: phoneNumber,
        propertiesType: propertiesType,
        isDeleted: false,
        debitur: debitur,
      },
    ]).select();

  if (propertyError) {
    throw new Error(`Error adding property: ${propertyError.message}`);
  }

  if (propertyData == null) {
    throw new Error("Property data is null");
  }

  const propertyId = (propertyData[0] as Property).id;

  // Insert the valuations
  const valuations = [
    {
      landValue: landValue,
      buildingValue: buildingValue,
      totalValue: totalValue,
      reportNumber: reportNumber,
      valuationDate: valuationDate,
      PropertyId: propertyId,
    },
  ];

  const { data: valuationData, error: valuationError } = await supabase
    .from("valuations")
    .insert(valuations).select();

  if (valuationError) {
    throw new Error(`Error adding valuations: ${valuationError.message}`);
  }

  return {
    property: propertyData as Property[],
    valuations: valuationData as unknown as Valuation[],
  };
};

export const updateValuation = async (id: number, changes: any) => {
  const { data, error } = await supabase
    .from("valuations")
    .update(changes)
    .eq("PropertyId", id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
