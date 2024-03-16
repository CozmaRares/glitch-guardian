import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const pass = z.string().min(6);
// .refine(
//   pass =>
//     /[A-Z]/.test(pass) && // At least 1 uppercase letter
//     /[a-z]/.test(pass) && // At least 1 lowercase letter
//     /[0-9]/.test(pass) && // At least 1 digit
//     /[@#$%&!?]/.test(pass), // At least 1 special character
//   {
//     message:
//       "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 of the following characters: @#$%&!?.",
//   },
// )
export const userLoginValidator = z.object({
  username: z.string().min(3).max(30),
  password: pass,
});
export type UserLoginSchema = z.infer<typeof userLoginValidator>;

export const userRegisterValidator = userLoginValidator
  .extend({ confirm: pass })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
  });
export type UserRegisterSchema = z.infer<typeof userRegisterValidator>;
