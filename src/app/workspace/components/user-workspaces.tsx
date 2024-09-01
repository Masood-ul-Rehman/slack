import React, { useEffect, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { usePathname, useRouter } from "next/navigation";
import { captializeFirstLetter } from "@/lib/utils";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Workspace } from "@/features/workspaces/types";
import { Loader } from "lucide-react";
import { Plus } from "@phosphor-icons/react";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

const UserWorkspaces = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const path = usePathname();
  let id = path.split("/")[2];
  const { data, isLoading } = useGetWorkspaces();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  useEffect(() => {
    if (isLoading) return;
    if (data && data?.result?.length > 0) {
      const currWorkspace = data.result.find(
        (workspace: any) => workspace.workspaceId == id
      );
      setWorkspace(currWorkspace as Workspace);
    }
  }, [data, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-lg ">
          <Avatar className="h-10 w-10 rounded-lg">
            {workspace?.image ? (
              <AvatarImage src={workspace?.image} alt={workspace?.name} />
            ) : (
              <AvatarFallback className="bg-gray-400 text-black h-10 w-10 rounded-lg">
                {workspace?.name?.charAt(0).toUpperCase() || "S"}
              </AvatarFallback>
            )}
          </Avatar>
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
              {captializeFirstLetter(workspace?.name || "slack")}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {workspace?.name?.split(" ").join("-") + "-talk.slack.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          data &&
          data?.result.length > 0 &&
          data?.result?.map((allSpa: Workspace, index) => (
            <div
              key={index}
              className="flex flex-col gap-2  px-1 py-1 text-sm cursor-pointer "
              onClick={() => router.push(`/workspace/${allSpa.workspaceId}`)}
            >
              {allSpa.workspaceId !== workspace?.workspaceId && (
                <DropdownMenuItem
                  key={allSpa._id}
                  className="flex items-center gap-3 "
                >
                  <Avatar className="h-10 w-10 rounded-lg">
                    {allSpa?.image ? (
                      <AvatarImage src={allSpa?.image} alt={allSpa?.name} />
                    ) : (
                      <AvatarFallback className="bg-gray-100 text-black h-10 w-10 rounded-lg">
                        {allSpa?.name?.charAt(0).toUpperCase() || "S"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h4>{captializeFirstLetter(allSpa?.name || "slack")}</h4>
                    <p className="text-xs leading-none text-muted-foreground">
                      {allSpa?.name?.split(" ").join("-") + "-talk.slack.com"}
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
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
