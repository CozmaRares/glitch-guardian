"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type ChangeEventHandler,
  type FormEventHandler,
  useEffect,
  useState,
} from "react";
import Avatar from "@/components/utils/Avatar";
import { toast } from "@/components/ui/use-toast";

export default function Page() {
  return <UpdateProfileAvatar />;
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

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    if (!selectedFile) return toast({ description: "Please select a file!" });

    const formData = new FormData();
    formData.append("file", selectedFile);

    let response;

    try {
      response = await fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      });
    } catch {
      return toast({
        description: "There was an erorr updating your file, please try again",
      });
    }

    if (response.redirected) window.location.href = response.url;
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
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="avatar">Avatar</Label>
          <Input
            id="avatar"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <button>Update</button>
      </form>

      <div>
        <p>Preview</p>
        <Avatar
          size={50}
          username="Preview"
          imageURL={selectedImage ?? null}
        />
      </div>
    </div>
  );
}
