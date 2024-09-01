"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Loader, User } from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/logo.png";
import NoWorkspaces from "./components/no-workspaces";
import ExistingWorkspaces from "./components/existing-workspace";
import UserButton from "@/features/auth/components/user-button";

const GetStarted = () => {
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaces();
  const [existingWorkspaces, setExistingWorkspaces] = useState<string | null>(
    localStorage.getItem("workspaceId")
  );
  useEffect(() => {
    if (isLoading) return;
    console.log(data, "data from getstarted");
    if (data) {
      if (data.error == "Unauthorized") router.replace("/auth/signin");
      if (data.result?.length == 1)
        router.replace(`/workspace/${data.result[0].workspaceId}`);
    }
  }, [data, isLoading, router]);

  return (
    <div className="h-[100vh] bg-[#f4ede480]">
      <UserButton />
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {data && data?.result.length > 1 ? (
            <>
              <div className="text-center pt-8 flex justify-center items-center">
                <Image src={logo} alt="Logo" width={150} height={150} />
                <div></div>
                {/* <ExistingWorkspaces workspaces={data} /> */}
              </div>
            </>
          ) : (
            <NoWorkspaces />
          )}
        </>
      )}
    </div>
  );
};

export default GetStarted;
