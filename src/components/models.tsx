"use client";

import { useEffect, useState } from "react";
import CreateWorkSpaceModel from "@/features/workspaces/components/create-workspace-modal";

const Models = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      <CreateWorkSpaceModel />
    </>
  );
};
export default Models;
