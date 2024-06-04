import { z } from "zod";
import { taskPriorities, projectStatuses, taskStatuses } from "./data";

const passwordValidator = z
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

const usernameValidatorInternal = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long." })
  .max(30, { message: "Username must be at most 30 characters long." })
  .refine(username => username === username.toLowerCase(), {
    message: "Username must only contain lowercase letters.",
  });

export const usernameValidator = z.object({
  username: usernameValidatorInternal,
});
export type UsernameSchema = z.infer<typeof usernameValidator>;

export const userLoginValidator = z.object({
  username: usernameValidatorInternal,
  password: passwordValidator,
});
export type UserLoginSchema = z.infer<typeof userLoginValidator>;

export const userRegisterValidator = userLoginValidator
  .extend({ confirm: passwordValidator })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match.",
    path: ["confirm"],
  });
export type UserRegisterSchema = z.infer<typeof userRegisterValidator>;

export const projectValidator = z.object({
  name: z.string().max(255),
  description: z.string().max(255),
  status: z.enum(projectStatuses),
});
export type ProjectSchema = z.infer<typeof projectValidator>;

export const taskValidator = z.object({
  name: z.string().max(255),
  projectID: z.string(),
  description: z.string().max(255),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities),
});
export type TaskSchema = z.infer<typeof taskValidator>;
