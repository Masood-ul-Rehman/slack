import React from "react";
import UseGetId from "@/features/hooks/use-get-Id";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { Info } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Searchbar = () => {
  const { workspaceId } = UseGetId();
  const { data, isLoading } = useGetWorkspaceById({ id: workspaceId });
  return (
    <div className="h-12 bg-slack_dark_bg flex justify-between items-center px-2">
      <div className="flex-1"></div>
      <div className="flex-1 bg-accent/20 rounded-sm text-white px-2 py-1 flex justify-between items-center">
        <h4 className="text-sm">Search in {data?.result?.name || "slack"}</h4>
        <Search className="size-4 text-gray-300" />
      </div>
      <div className="flex-1  flex justify-end items-center">
        <Button variant="transparent" size={"iconSm"} className=" text-white">
          <Info className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default Searchbar;
