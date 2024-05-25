"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  size: number;
  username: string;
  imageURL: string | null;
  className?: string;
  fallbackColor?: string;
};

export default function Avatar({
  size,
  username,
  imageURL,
  className,
  fallbackColor,
}: Props) {
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
      {imageError || imageURL == null ? (
        <span
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            fallbackColor,
          )}
        >
          {getUsernameInitials(username)}
        </span>
      ) : (
        <Image
          src={imageURL}
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
