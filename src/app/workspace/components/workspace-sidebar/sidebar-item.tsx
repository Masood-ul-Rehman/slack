import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

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
}: {
  icon: React.ReactNode;
  label: string;
  link: string;
  variant?: "default" | "active";
}) => {
  return (
    <Button variant="ghost" className={cn(sidebarVariants({ variant }))}>
      <Link href={link} className="flex gap-2 items-center">
        {icon}
        <h3 className="text-md font-medium tracking-normal">{label}</h3>
      </Link>
    </Button>
  );
};

export default SidebarItem;
