export function formatDate(inputDate) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [year, month, day] = inputDate.split("-");
  const monthAbbreviation = months[parseInt(month, 10) - 1];

  return `${day} ${monthAbbreviation}, ${year}`;
}

/**
 
 * Return data in Month Year format
 
 * 
 
 * @param {String} date - Date in any format accepted by DateConstructor
 
 * @returns {number} Date in Month Year format
 
 * 
 
 * @example
 
 * const formattedDate = getDateInMonthYear('2024-07-22')
 
 * console.log(formattedDate); // Output: July 2024
 
 */
export function getDateInMonthYear(date) {
  let dateConverted;
  if (date) dateConverted = new Date(date);
  else dateConverted = new Date();
  const options = { month: "long", year: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(dateConverted);
}
