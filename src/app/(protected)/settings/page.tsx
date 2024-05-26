"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type ChangeEventHandler,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import Avatar from "@/components/utils/Avatar";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { type UsernameSchema, usernameValidator } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Page() {
  return (
    <main className="space-y-20 p-8">
      <UpdateProfileAvatar />
      <UpdateUserName />
    </main>
  );
}

function UpdateProfileAvatar() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<string>();

  useEffect(
    () => () => {
      if (selectedImage) URL.revokeObjectURL(selectedImage);
    },
    [selectedImage],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) return toast({ description: "Please select a file!" });

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw "";

      if (response.redirected) window.location.href = response.url;
    } catch {
      toast({
        variant: "destructive",
        title: "There was an erorr updating your file. Please try again later.",
      });
    }
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    if (!target.files) return;

    if (selectedImage) URL.revokeObjectURL(selectedImage);

    const file = target.files[0];
    setSelectedImage(URL.createObjectURL(file as Blob));
    setSelectedFile(file);
  };

  return (
    <div className="flex flex-row gap-20">
      <form
        onSubmit={handleSubmit}
        className="items-left flex w-[500px] max-w-full flex-col gap-3 rounded-2xl border p-4"
      >
        <Label
          htmlFor="avatar"
          className="ml-1 text-lg font-bold"
        >
          Change Avatar Image
        </Label>
        <Input
          id="avatar"
          type="file"
          onChange={handleFileChange}
          className="border-border"
        />
        <Button
          variant="outline"
          className="border-border"
        >
          Update
        </Button>
      </form>

      <div className="flex flex-col items-center gap-4">
        <p className="text-xl">Preview</p>
        <Avatar
          size={100}
          username="Preview"
          imageURL={selectedImage ?? null}
        />
      </div>
    </div>
  );
}

function UpdateUserName() {
  const form = useForm<UsernameSchema>({
    resolver: zodResolver(usernameValidator),
    defaultValues: {
      username: "",
    },
  });

  const [isDisabled, setDisabled] = useState(false);
  const router = useRouter();
  const mutation = api.user.changeName.useMutation({
    onError(err) {
      toast({
        variant: "destructive",
        title: "Server error",
        description: err.message,
      });
      setDisabled(false);
    },
    onSuccess() {
      router.refresh();
    },
  });

  const onSubmit = (data: UsernameSchema) => {
    setDisabled(true);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[500px] max-w-full space-y-4 rounded-2xl border p-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-bold">
                Change Username
              </FormLabel>
              <FormControl>
                <Input
                  className="border-border"
                  placeholder="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isDisabled}
          type="submit"
          className="w-full border-border text-center"
          variant="outline"
        >
          Update
        </Button>
      </form>
    </Form>
  );
}
