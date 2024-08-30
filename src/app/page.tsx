"use client";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useEffect, useMemo } from "react";
export default function Home() {
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useCurrentUser();
  const workspaceId = useMemo(() => data?._id, [data]);
  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      console.log(workspaceId);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [workspaceId, isLoading, isOpen, setIsOpen]);
  return <div></div>;
}
