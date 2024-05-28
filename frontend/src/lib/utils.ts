import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function searchMerchants(merchants: any[], searchString: string): any[] {
  if (!searchString) {
    return [];
  }

  // Convert the search string to lowercase for case-insensitive comparison
  const lowerCaseSearchString = searchString.toLowerCase();

  // Filter merchants whose names partially match the search string
  const matchingMerchants = merchants.filter((merchant) =>
    merchant.name.toLowerCase().startsWith(lowerCaseSearchString)
  );

  // Return the first 3 matching merchants
  return matchingMerchants.slice(0,3);
}