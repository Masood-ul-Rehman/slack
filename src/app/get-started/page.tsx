"use client";

import React, { useEffect, useState } from "react";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Loader } from "lucide-react";
import ExistingWorkspaces from "./components/existing-workspace";
import NoWorkspaces from "./components/no-workspaces";

const GetStarted = () => {
  const { data, isLoading } = useGetWorkspaces();
  const [existingWorkspaces, setExistingWorkspaces] = useState<string | null>(
    localStorage.getItem("workspaces")
  );
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (isLoading) return;
    if (data?.length === 0) {
      setOpen(true);
    }
  }, [data, isLoading]);
  return (
    <div>
      {isLoading ? (
        <Loader className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <div>
          {data?.length && data?.length > 0 ? (
            <ExistingWorkspaces workspaces={data} />
          ) : (
            <NoWorkspaces />
          )}
        </div>
      )}
    </div>
  );
};

export default GetStarted;
