import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, alt = "Avatar", src }: { src: string; alt?: string; className?: string }) {
  // Use next/image for better optimization in Next.js
  return (
    <Image
      data-slot="avatar-image"
      src={src}
      alt={alt}
      width={40}
      height={40}
      className={cn("aspect-square h-full w-full object-cover", className)}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };