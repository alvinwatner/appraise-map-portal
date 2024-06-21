import { supabase } from "./../lib/supabaseClient";
import { Property } from "./../types/types";

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
      object_type,
      valuations!inner(
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
    .order("id", { ascending: false });

  if (search) {
    query = query.ilike("debitur", `%${search}%`);
  }

  if (filters.propertyType) {
    query = query.eq("propertiesType", filters.propertyType);
  }

  if (filters.objectType) {
    query = query.eq("object_type", filters.objectType);
  }

  if (filters.minTotalValue !== undefined) {
    query = query.gte("valuations.totalValue", filters.minTotalValue);
  }

  if (filters.maxTotalValue !== undefined) {
    query = query.lte("valuations.totalValue", filters.maxTotalValue);
  }

  if (filters.valuationDate) {
    query = query.eq("valuations.valuationDate", filters.valuationDate); // Type assertion to any
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
  if (changes.locations) {
    const { error } = await supabase
      .from("locations")
      .update(changes.locations)
      .eq("id", changes.locations.id)
      .select();
    if (error) {
      throw new Error(error.message);
    }
  }
  delete changes.locations;
  delete changes.valuations;
  const { data, error } = await supabase
    .from("properties")
    .update(changes)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateValuation = async (id: number, changes: any) => {
  const { data, error } = await supabase
    .from("valuations")
    .update(changes)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const fetchAllProperties = async (
  search: string = "",
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
      object_type,
      valuations!inner(
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
    query = query.ilike("debitur", `%${search}%`);
  }

  if (filters.propertyType) {
    query = query.eq("propertiesType", filters.propertyType);
  }

  if (filters.valuationDate) {
    query = query.eq("valuations.valuationDate", filters.valuationDate);
  }

  if (filters.objectType) {
    query = query.eq("object_type", filters.objectType);
  }

  if (filters.minTotalValue !== undefined) {
    query = query.gte("valuations.totalValue", filters.minTotalValue);
  }

  if (filters.maxTotalValue !== undefined) {
    query = query.lte("valuations.totalValue", filters.maxTotalValue);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
    return { data: [], total: 0 };
  }

  return { data: data as unknown as Property[], total: count || 0 };
};

export async function fetchObjectTypes(): Promise<string[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("object_type");

  if (error) {
    throw new Error(error.message);
  }

  // Extract unique object_type values
  const objectTypes = Array.from(
    new Set(data.map((item: any) => item.object_type))
  );

  return objectTypes;
}
