import React from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { captializeFirstLetter } from "@/lib/utils";

const ExistingWorkspaces = ({ workspaces }: any) => {
  const router = useRouter();
  return (
    <div className="bg-[#f4ede480] w-[40%] rounded-xl p-4 mt-4">
      {workspaces?.result.map((workspace: any, index: number) => {
        return (
          <div
            key={index}
            className="flex justify-between items-center text-start gap-4 px-2 py-2"
          >
            <div className="flex items-center gap-6">
              <Avatar className="h-12 w-12 rounded-lg">
                {workspace?.image ? (
                  <AvatarImage src={workspace?.image} alt={workspace?.name} />
                ) : (
                  <AvatarFallback className="bg-gray-100 text-black 12 w-12 rounded-lg">
                    {workspace?.name?.charAt(0).toUpperCase() || "S"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h4>{captializeFirstLetter(workspace?.name || "slack")}</h4>
                <p className="text-xs leading-none text-muted-foreground">
                  {workspace?.name?.split(" ").join("-") + "-talk.slack.com"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/workspace/${workspace.workspaceId}`)}
            >
              Go to workspace
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ExistingWorkspaces;
