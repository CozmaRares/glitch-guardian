"use client";

import { type UserRegisterSchema, userRegisterValidator } from "@/lib/zod";
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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { api as trpc } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function RegisterForm() {
  const form = useForm<UserRegisterSchema>({
    resolver: zodResolver(userRegisterValidator),
    defaultValues: {
      username: "",
      password: "",
      confirm: "",
    },
  });

  const [isDisabled, setDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const registerMutation = trpc.auth.passRegister.useMutation({
    onError(err) {
      toast({
        variant: "destructive",
        title: "Server error",
        description: err.message,
      });
      setDisabled(false);
    },
    onSuccess() {
      router.replace("/");
    },
  });

  const onSubmit = (data: UserRegisterSchema) => {
    setDisabled(true);
    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isDisabled}
          type="submit"
          className="mt-3 w-full text-center"
        >
          Register
        </Button>
      </form>
    </Form>
  );
}
