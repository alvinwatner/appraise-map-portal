export const formatRupiah = (amount: number): string => {
  return amount?.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str; // Return the original string if it's empty
  return str.charAt(0).toUpperCase() + str.slice(1);
}
