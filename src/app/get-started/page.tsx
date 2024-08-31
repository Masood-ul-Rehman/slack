"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Loader } from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/logo.png";

const GetStarted = () => {
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaces();
  const [existingWorkspaces, setExistingWorkspaces] = useState<string | null>(
    localStorage.getItem("workspaces")
  );
  useEffect(() => {
    if (isLoading) return;
    if (data == "User not logged in") router.replace("/auth/signin");
  }, [data, isLoading, router]);

  return (
    <div className="h-[100vh] bg-[#f4ede480]">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {data?.length && data?.length > 0 ? (
            <>
              <div className="text-center pt-8 flex justify-center items-center">
                <Image src={logo} alt="Logo" width={150} height={150} />
                <div></div>
              </div>
            </> // <ExistingWorkspaces workspaces={data} />
          ) : (
            <></> // <NoWorkspaces />
          )}
        </>
      )}
    </div>
  );
};

export default GetStarted;
