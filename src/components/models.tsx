"use client";

import { useEffect, useState } from "react";
import CreateWorkSpaceModel from "@/features/workspaces/components/create-workspace-modal";
import CreateChannelDialog from "@/app/workspace/components/workspace-sidebar/channels/create-channel-dialog";

const Models = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      <CreateWorkSpaceModel />
      <CreateChannelDialog />
    </>
  );
};
export default Models;
