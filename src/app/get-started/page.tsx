"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Loader } from "lucide-react";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import logo from "@/app/assets/logo.png";
import NoWorkspaces from "./components/no-workspaces";
import ExistingWorkspaces from "./components/existing-workspace";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { Button } from "@/components/ui/button";

const GetStarted = () => {
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaces();
  const { data: user, isLoading: _isLoadingUser } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;
    if (data) {
      if (data.error == "Unauthorized" || user?.error)
        router.replace("/auth/signin");
      if (data.result?.length == 1)
        router.replace(`/workspace/${data.result[0].workspaceId}`);
    }
  }, [data, user, isLoading, router]);

  return (
    <div className="h-[100vh] bg-[#f4ede480]">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {data && data?.result.length > 1 ? (
            <>
              <div className="text-center pt-8 flex flex-col justify-center items-center">
                <Image src={logo} alt="Logo" width={150} height={150} />
                <h4 className="font-bold mt-8 text-xl">
                  Welcome Back {user?.result?.name}
                </h4>
                <p>Select a workspace to continue</p>
                <ExistingWorkspaces workspaces={data} />
                <p className="mt-4">or</p>
                <Button
                  variant="outline"
                  className="mt-6 bg-slack_dark_bg text-white font-semibold"
                >
                  Create a new workspace
                </Button>
              </div>
            </>
          ) : (
            <NoWorkspaces name={user?.result?.name || "to slack"} />
          )}
        </>
      )}
    </div>
  );
};

export default GetStarted;
