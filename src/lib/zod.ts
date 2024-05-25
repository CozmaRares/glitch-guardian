
import { z } from "zod";

const pass = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long." })
  .refine(
    pass =>
      /[A-Z]/.test(pass) && // At least 1 uppercase letter
      /[a-z]/.test(pass) && // At least 1 lowercase letter
      /[0-9]/.test(pass) && // At least 1 digit
      /[@#$%&!?]/.test(pass), // At least 1 special character
    {
      message:
        "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 of the following characters: @#$%&!?.",
    },
  );

export const userLoginValidator = z.object({
  email: z.string().email(),
  password: pass,
});
export type UserLoginSchema = z.infer<typeof userLoginValidator>;

export const userRegisterValidator = userLoginValidator
  .extend({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long." })
      .max(30, { message: "Username must be at most 30 characters long." })
      .refine(username => username === username.toLowerCase(), {
        message: "Username must only contain lowercase letters.",
      }),
    confirm: pass,
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match.",
    path: ["confirm"],
  });
export type UserRegisterSchema = z.infer<typeof userRegisterValidator>;
