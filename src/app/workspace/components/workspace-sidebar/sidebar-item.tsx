import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";

const sidebarVariants = cva(
  "w-full justify-start px-4 hover:bg-accent/20 hover:text-white py-1 hover:py-1 h-fit",
  {
    variants: {
      variant: {
        default: "",
        active: "bg-accent/20   text-white",
      },
    },
  }
);
const SidebarItem = ({
  icon,
  label,
  link,
  variant,
  channelNotifications,
}: {
  icon: React.ReactNode;
  label: string;
  link: string;
  variant?: "default" | "active";
  channelNotifications?: Notification[] | null;
}) => {
  console.log(channelNotifications, "this is notification comming");
  return (
    <Button variant="ghost" className={cn(sidebarVariants({ variant }))}>
      <Link
        href={link}
        className="flex gap-2 items-center justify-between w-full"
      >
        <div className="flex gap-2 items-center">
          {icon}
          <h3 className="text-md font-medium tracking-normal">{label}</h3>
        </div>
        {channelNotifications && channelNotifications?.length > 0 && (
          <Badge className="bg-accent/30 text-accent">
            {channelNotifications?.length > 9
              ? `9+`
              : channelNotifications?.length}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default SidebarItem;
