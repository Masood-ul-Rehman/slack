"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { Button } from "./ui/button";
import logo from "@/app/assets/logo.png";

const Header = () => {
  const { data, isLoading } = useCurrentUser();

  return (
    <div className=" container flex justify-between items-center py-12">
      <Image src={logo} alt="Logo" width={150} height={150} />
      <div className="flex gap-8 items-center">
        {isLoading ? (
          <h4 className="font-medium">Sign in</h4>
        ) : data ? (
          <Link href={`/workspace/${data._id}`}>
            <Button variant={"outline"}>Go to workspace</Button>
          </Link>
        ) : (
          <h4 className="font-medium">Sign in</h4>
        )}
        {!data && (
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
