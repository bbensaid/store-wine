export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
};

export const formatDate = (date: Date | string | null | undefined) => {
  if (!date) {
    return "Unknown date";
  }
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "Invalid date";
  }
};
