"use client";
import { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPopover = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji.native);
    setPopoverOpen(false);
    setTimeout(() => {
      setToolTipOpen(false);
    }, 500);
  };
  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={toolTipOpen}
          onOpenChange={setToolTipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border-white/5">
            <p className="text-xs font-medium">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          className="p-0  w-full border-none shadow-none relative bottom-12 left-28"
          align="center"
        >
          <Picker data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
export default EmojiPopover;
