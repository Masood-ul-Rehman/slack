import React, { useState } from "react";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CreateChannelDialog from "./create-channel-dialog";
const ChannelDropdown = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant={"transparent"}
            className="px-2 py-1 hover:py-1 h-fit text-[#f9edffc] shrink-0 text-sm group relative font-medium"
          >
            Channels
            <CaretDown
              size={12}
              className="transition-transform duration-300 opacity-0 group-hover:opacity-100 relative left-1"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem
            className="flex items-center gap-2 w-full justify-between"
            onClick={() => setOpen(true)}
          >
            <span>Create Channel</span>
            <CaretRight size={16} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 w-full justify-between">
            <span>Manage Channels</span>
            <CaretRight size={16} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {open && (
        <CreateChannelDialog open={open} onCancel={() => setOpen(false)} />
      )}
    </>
  );
};

export default ChannelDropdown;
