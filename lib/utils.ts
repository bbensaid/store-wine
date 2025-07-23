import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Consistent styling classes for UI components
export const uiStyles = {
  // Dropdown/Select components
  dropdown: {
    trigger: "text-primary border border-primary/20",
    content: "text-primary border border-primary/20",
    item: "text-primary",
    icon: "text-primary"
  },
  
  // Button components - Reference: "Wines" button in Navbar
  button: {
    primary: "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary",
    active: "bg-gray-200 text-primary border-gray-400",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
    icon: "text-primary" // All icons should use primary color
  },
  
  // Input components
  input: {
    base: "text-primary placeholder:text-primary border border-primary/20"
  },
  
  // Label components
  label: {
    base: "text-primary"
  }
} as const
