/**
 * FORMATTING UTILITIES - This provides utility functions for formatting data presentation
 *
 * WHAT THIS FILE DOES:
 * - Formats currency amounts for display (converts cents to dollars)
 * - Formats dates into human-readable strings
 * - Handles edge cases and error conditions gracefully
 * - Provides consistent formatting across the application
 * - Ensures proper data presentation for users
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a utility file that handles data formatting
 * - Currency formatting converts database cents to display dollars
 * - Date formatting handles various input types safely
 * - Error handling prevents crashes from invalid data
 * - These functions are used throughout the app for consistent display
 *
 * TECHNOLOGIES USED:
 * - Intl.NumberFormat (for currency formatting)
 * - Intl.DateTimeFormat (for date formatting)
 * - TypeScript (for type safety and null handling)
 * - Error handling (for graceful failure handling)
 * - Data validation (for input sanitization)
 */

/**
 * FORMAT CURRENCY FUNCTION
 *
 * This function converts a number representing cents into a formatted
 * currency string for display. It handles the conversion from cents
 * to dollars and applies proper currency formatting.
 *
 * BEGINNER TIP: Think of this as a "money formatter" that takes
 * the raw number from the database and makes it look nice for users.
 *
 * Parameters: amount - number representing cents (e.g., 2500 = $25.00)
 * Returns: Formatted currency string (e.g., "$25.00")
 * Usage: formatCurrency(wine.price) // wine.price is stored in cents
 *
 * Examples:
 * - formatCurrency(2500) → "$25.00"
 * - formatCurrency(100) → "$1.00"
 * - formatCurrency(0) → "$0.00"
 */
export const formatCurrency = (amount: number) => {
  //
  // CURRENCY FORMATTING PROCESS
  //
  // 1. Convert cents to dollars by dividing by 100
  // 2. Use Intl.NumberFormat for proper currency formatting
  // 3. Return the formatted string

  return new Intl.NumberFormat("en-US", {
    style: "currency", // Format as currency
    currency: "USD", // Use US Dollar currency
  }).format(amount / 100); // Convert cents to dollars
};

/**
 * FORMAT DATE FUNCTION
 *
 * This function converts various date inputs into human-readable
 * date strings. It handles different input types safely and provides
 * consistent date formatting across the application.
 *
 * BEGINNER TIP: Think of this as a "date translator" that takes
 * any date format and converts it to a user-friendly display.
 *
 * Parameters: date - Date object, string, null, or undefined
 * Returns: Formatted date string or fallback message
 * Usage: formatDate(wine.createdAt) // wine.createdAt from database
 *
 * Examples:
 * - formatDate(new Date()) → "August 16, 2025"
 * - formatDate("2025-08-16") → "August 16, 2025"
 * - formatDate(null) → "Unknown date"
 * - formatDate("invalid") → "Invalid date"
 */
export const formatDate = (date: Date | string | null | undefined) => {
  //
  // NULL/UNDEFINED HANDLING
  //
  // If no date is provided, return a fallback message
  // This prevents errors when displaying dates that don't exist

  if (!date) {
    return "Unknown date";
  }

  try {
    //
    // DATE CONVERSION
    //
    // Convert string dates to Date objects if needed
    // This ensures we can work with the date consistently

    const dateObj = typeof date === "string" ? new Date(date) : date;

    //
    // DATE VALIDATION
    //
    // Check if the date is valid using getTime() method
    // Invalid dates return NaN, which we can detect

    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    //
    // DATE FORMATTING
    //
    // Use Intl.DateTimeFormat for consistent, localized date formatting
    // This provides proper month names and formatting

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric", // Full year (e.g., 2025)
      month: "long", // Full month name (e.g., August)
      day: "numeric", // Day of month (e.g., 16)
    }).format(dateObj);
  } catch (error) {
    //
    // ERROR HANDLING
    //
    // If anything goes wrong during date formatting, catch the error
    // Log it for debugging and return a user-friendly message

    // Log the error for developers (in production, this might go to a logging service)
    console.error("Error formatting date:", error, date);

    // Return a fallback message that won't crash the UI
    return "Invalid date";
  }
};
