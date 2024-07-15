export const formatRupiah = (amount: number): string => {
  return amount?.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str; // Return the original string if it's empty
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const filterNumeric = (str: string): string => {
  // Strip out non-numeric characters
  const numericValue = str.replace(/[^0-9]/g, "");
  return numericValue;
};

export const getTimeAgo = (createdAt: string) => {
  const date = new Date(createdAt).getTime();
  const now = new Date().getTime();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);

  if (seconds < 60) {
    return "barusan";
  } else if (minutes === 1) {
    return "1 menit lalu";
  } else if (minutes < 60) {
    return `${minutes} menit lalu`;
  } else if (hours === 1) {
    return "1 jam lalu";
  } else if (hours < 24) {
    return `${hours} jam lalu`;
  } else if (days === 1) {
    return "1 hari lalu";
  } else if (days < 30) {
    return `${days} hari lalu`;
  } else if (months === 1) {
    return "1 bulan lalu";
  } else if (months < 12) {
    return `${months} bulan lalu`;
  } else {
    return "telah sekian lama";
  }
};
