"use client";
import Header from "@/components/header";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
export default function Home() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();
  // const workspaceId = useMemo(() => data?._id, [data]);
  useEffect(() => {
    if (isLoading) return;
    console.log(data, ":adf");
    // if (workspaceId) {
    //   router.replace(`/workspace/${workspaceId}`);
    // } else if (!isOpen) {
    //   setIsOpen(true);
    // }
  }, [isLoading, isOpen, setIsOpen, router, data]);
  return (
    <div>
      <Header />
    </div>
  );
}
