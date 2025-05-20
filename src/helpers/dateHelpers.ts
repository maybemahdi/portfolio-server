const convertToISO = (dateStr: string): string => {
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`).toISOString();
};

export const dateHelpers = {
  convertToISO,
};
