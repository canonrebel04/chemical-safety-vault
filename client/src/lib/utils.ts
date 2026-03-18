import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // Validate inputs to ensure they are safe class names
  const validatedInputs = inputs.map(input => {
    if (typeof input === 'string') {
      // Basic validation to ensure the input is a safe class name
      if (/^[a-zA-Z0-9-_:/\s]+$/.test(input)) {
        return input;
      } else {
        console.warn(`Invalid class name: ${input}`);
        return '';
      }
    }
    return input;
  });
  return twMerge(clsx(validatedInputs));
}
