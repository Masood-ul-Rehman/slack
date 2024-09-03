import React from "react";
import { Tooltip, TooltipContent, TooltipProvider } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
}

const Hint = ({ label, children, side = "bottom", align }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="bg-black text-white border-gray-500"
        >
          <p className="text-xs font-medium leading-none">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;
