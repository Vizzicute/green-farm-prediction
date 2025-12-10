// Return local YYYY-MM-DD (use local date parts to avoid UTC offset issues)
export const formattedDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
export const formattedTime = (date: Date): string =>
  date.toTimeString().split(":").slice(0, 2).join(":");

export function customFormatDateText(date: string) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let text = formattedDate(new Date(date));

  if (formattedDate(today) === formattedDate(new Date(date))) text = "Today";
  if (formattedDate(yesterday) === formattedDate(new Date(date)))
    text = "Yesterday";
  if (formattedDate(tomorrow) === formattedDate(new Date(date)))
    text = "Tomorrow";

  return text;
}

export const dateString = (date: Date) => {
    const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    let text = date.toDateString();

    // Use formattedDate (local YYYY-MM-DD) for comparisons to avoid UTC shifts
    if (formattedDate(today) === formattedDate(date)) text = "Today";
    if (formattedDate(yesterday) === formattedDate(date)) text = "Yesterday";
    if (formattedDate(tomorrow) === formattedDate(date)) text = "Tomorrow";
    
    return text;
  }