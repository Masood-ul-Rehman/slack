import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
const WorkspaceAvatar = ({
  img,
  name,
  styles,
}: {
  img?: string;
  name?: string;
  styles?: string;
}) => {
  return (
    <Avatar className={cn("h-10 w-10 rounded-lg", styles)}>
      {img ? (
        <AvatarImage src={img} alt={name} />
      ) : (
        <AvatarFallback
          className={cn("bg-gray-100 text-black h-10 w-10 rounded-lg", styles)}
        >
          {name?.charAt(0).toUpperCase() || "S"}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default WorkspaceAvatar;
