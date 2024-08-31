"use client";
import UserButton from "@/features/auth/components/user-button";
import { useAuthActions } from "@convex-dev/auth/react";
import { auth } from "@/convex/auth"; // Import the auth hook
import { getAuthUserId } from "@convex-dev/auth/server";

import React from "react";
import Image from "next/image";
import logo from "@/app/assets/logo.svg";
const Header = () => {
  const { signOut } = useAuthActions();
  const userId = auth.getUserId;

  return (
    <div className=" container flex justify-between items-center py-8">
      <div>
        <Image src={logo} alt="Logo" width={50} height={50} />
      </div>
      <UserButton />
    </div>
  );
};

export default Header;
