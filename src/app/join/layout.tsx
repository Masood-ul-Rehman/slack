"use client";
import React, { use, useMemo } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import Image from "next/image";
import { Loader } from "lucide-react";
import logo from "@/app/assets/logo.png";

import { useGetWorkspaceName } from "@/features/workspaces/api/use-get-workspace-name";
import { useGetUser } from "@/features/users/api/use-get-user";
import AuthForm from "@/features/auth/components/auth-form";

const JoinLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { workspaceId, inviteId } = useParams();

  const { data: workspaceName, isLoading: isWorkspaceNameLoading } =
    useGetWorkspaceName(workspaceId as string);
  const { data: user, isLoading: userLoading } = useGetUser();
  const alreadyMember = useMemo(() => {
    if (!user?.result || !workspaceName?.result?.members) return false;
    return workspaceName.result.members.some(
      (memberId) => memberId.userId === user.result?._id
    );
  }, [user, workspaceName]);

  if (isWorkspaceNameLoading || userLoading)
    return (
      <div className="flex justify-center flex-col gap-4  items-center h-screen bg-[#f4ede480]">
        <Loader className="size-8 animate-spin text-muted-foreground" />
        <h4 className="text-muted-foreground">
          Loading your requested workspace...
        </h4>
      </div>
    );
  if (alreadyMember) router;
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f4ede480]">
      <Image src={logo} alt="Logo" width={250} height={250} />
      {user?.error ? (
        <div className="w-full  flex items-center flex-col">
          <h4 className="text-2xl font-semibold text-center">
            You are not logged in to join <br /> {workspaceName?.result?.name}
          </h4>
          <p className="text-md mt-2 my-4 text-muted-foreground">
            Signin or Signup to join workspace
          </p>
          <AuthForm type="signUp" />
        </div>
      ) : workspaceName?.result !== null ? (
        <div className="flex justify-center  flex-col gap-4  items-center ">
          <h4 className="text-2xl font-semibold">
            Join {workspaceName?.result?.name}
          </h4>
          <p>Type the invite code your coworker has sent </p>
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};
export default JoinLayout;
