"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import logo from "@/app/assets/logo.png";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";

const Header = () => {
  const { data, isLoading } = useCurrentUser();
  const [workspaceId, setWorkspaceId] = useState<string | null>(
    localStorage.getItem("workspaceId")
  );
  return (
    <div className=" container flex justify-between items-center py-12">
      <Image src={logo} alt="Logo" width={150} height={150} />
      <div className="flex gap-8 items-center">
        {isLoading || data?.error ? (
          <Link href={"/auth/signin"}>
            <h4 className="font-medium">Sign in</h4>
          </Link>
        ) : data && workspaceId ? (
          <Link href={`/workspace/${workspaceId}`}>
            <Button variant={"outline"}>Go to workspace</Button>
          </Link>
        ) : (
          data && (
            <Link href="/get-started">
              <Button variant={"outline"}>Get Started</Button>
            </Link>
          )
        )}
        {!data?.success && (
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
