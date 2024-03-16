"use client";

import { type UserLoginSchema, userLoginValidator } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/server/actions/auth";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

async function onSubmit(values: UserLoginSchema) {
  const result = await login(values);
  console.log(result);
}

export default function LoginForm() {
  const form = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginValidator),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isVisible, setIsVisible] = useState(false);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="username"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage className="absolute left-0 top-full" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isVisible ? "text" : "password"}
                    placeholder="password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
                  >
                    {isVisible ? <Eye /> : <EyeOff />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="absolute left-0 top-full" />
            </FormItem>
          )}
        />
        <div>
          <Link
            href="/auth/reset-password"
            className="ml-auto block w-fit italic underline opacity-80 transition-opacity hover:opacity-100"
          >
            Forgot password?
          </Link>
          <Button
            type="submit"
            className="mt-3 w-full text-center"
          >
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}
