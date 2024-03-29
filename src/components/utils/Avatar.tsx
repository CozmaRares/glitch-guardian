"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  size: number;
  username: string;
  imageUrl: string;
  className?: string;
};

export default function Avatar({ size, username, imageUrl, className }: Props) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      {imageError ? (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          {getUsernameInitials(username)}
        </span>
      ) : (
        <Image
          src={imageUrl}
          alt={`@${username}`}
          onError={() => setImageError(true)}
          className="aspect-square h-full w-full"
          width={size}
          height={size}
        />
      )}
    </div>
  );
}

function getUsernameInitials(username: string) {
  const words = username.trim().split(/\s+/);
  if (words.length >= 2) return words[0]![0]! + words[1]![0]!;
  else return username.slice(0, 2);
}
