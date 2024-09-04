import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Workspace } from "@/features/workspaces/types";
import { captializeFirstLetter } from "@/lib/utils";
import { CaretDown } from "@phosphor-icons/react";
import WorkspaceAvatar from "@/components/workspace-avater";
import PrefrencesModal from "./prefrences/prefrences-modal";

const WorkspaceDropdown = ({ workspace }: { workspace: Workspace }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center  cursor-pointer">
        <Button
          variant="transparent"
          size={"sm"}
          className="text-white h-[49px] "
        >
          <h4 className="text-xl font-bold truncate">
            {captializeFirstLetter(workspace?.name)}
          </h4>
          <CaretDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        className="min-w-[250px] py-3 px-3"
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-4 mb-1">
            <WorkspaceAvatar
              img={workspace?.image}
              name={workspace?.name}
              styles="h-12 w-12"
            />
            <div>
              <h4 className="text-md font-bold ">
                {captializeFirstLetter(workspace?.name)}
              </h4>
              <p className="text-xs text-gray-400">
                {workspace?.name}.slack.com
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpen(true)}>
          Workspace Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Invite People to your Workspace</DropdownMenuItem>
      </DropdownMenuContent>
      {open && (
        <PrefrencesModal
          open={open}
          onOpenChange={setOpen}
          workspace={workspace}
        />
      )}
    </DropdownMenu>
  );
};

export default WorkspaceDropdown;
