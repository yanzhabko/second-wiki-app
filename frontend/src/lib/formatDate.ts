enum Month {
  January = "01",
  February = "02",
  March = "03",
  April = "04",
  May = "05",
  June = "06",
  July = "07",
  August = "08",
  September = "09",
  October = "10",
  November = "11",
  December = "12",
}

const getMonthString = (monthIndex: number): string => {
  const months = Object.values(Month);
  return months[monthIndex] || "00";
};

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = getMonthString(date.getUTCMonth());
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
};

export const formatTime = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month} ${hours}:${minutes}`;
};
