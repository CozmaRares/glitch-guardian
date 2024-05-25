"use client";

import { type UserLoginSchema, userLoginValidator } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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

export default function LoginForm() {
  const form = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginValidator),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isDisabled, setDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const loginMutation = trpc.auth.passLogin.useMutation({
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

  const onSubmit = (data: UserLoginSchema) => {
    setDisabled(true);
    loginMutation.mutate(data);
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
        <Button
          disabled={isDisabled}
          type="submit"
          className="w-full text-center"
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
