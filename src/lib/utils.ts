import { toast } from "@/components/ui/use-toast";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mutationOptionsFactory(
  onSuccess: () => void,
  onAfterError?: (err: { message: string }) => void,
) {
  return {
    onError(err: { message: string }) {
      toast({
        variant: "destructive",
        title: "Server error",
        description: err.message,
      });

      if (onAfterError) onAfterError(err);
    },
    onSuccess,
  };
}
