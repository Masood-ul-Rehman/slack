import React from "react";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import WorkspaceAvatar from "@/components/workspace-avater";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Plus } from "@phosphor-icons/react";
import { Loader } from "lucide-react";
import { captializeFirstLetter } from "@/lib/utils";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Workspace } from "@/features/workspaces/types";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";

const UserWorkspaces = () => {
  const router = useRouter();
  const path = usePathname();
  let id = path.split("/")[2];
  const [_open, setOpen] = useCreateWorkspaceModal();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id,
  });
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const filteredWorkspaces = workspaces?.result.filter(
    (spaces) => spaces.workspaceId !== workspace?.result?.workspaceId
  );
  const { image, name } = workspace?.result || {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-lg ">
          <WorkspaceAvatar img={image} name={name} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="ml-5 mt-2 min-w-[300px] p-2 "
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {captializeFirstLetter(name || "slack")}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {name?.split(" ").join("-") + "-talk.slack.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {workspaceLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          filteredWorkspaces?.map((space: Workspace, index) => (
            <div
              key={index}
              className="flex flex-col gap-2  px-1 py-1 text-sm cursor-pointer "
              onClick={() => router.push(`/workspace/${space.workspaceId}`)}
            >
              <DropdownMenuItem
                key={space._id}
                className="flex items-center gap-3 "
              >
                <Avatar className="h-10 w-10 rounded-lg">
                  {space?.image ? (
                    <AvatarImage src={space?.image} alt={space?.name} />
                  ) : (
                    <AvatarFallback className="bg-gray-100 text-black h-10 w-10 rounded-lg">
                      {space?.name?.charAt(0).toUpperCase() || "S"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h4>{captializeFirstLetter(space?.name || "slack")}</h4>
                  <p className="text-xs leading-none text-muted-foreground">
                    {space?.name?.split(" ").join("-") + "-talk.slack.com"}
                  </p>
                </div>
              </DropdownMenuItem>
            </div>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div
            className="flex items-center gap-3 px-1  cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="bg-gray-100 rounded-lg h-10 w-10 flex items-center justify-center">
              <Plus />
            </div>
            Create a workspace
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserWorkspaces;
