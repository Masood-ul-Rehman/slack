"use client";
import UserButton from "@/features/auth/components/user-button";
import { useAuthActions } from "@convex-dev/auth/react";
import React from "react";

const Header = () => {
  const { signOut } = useAuthActions();

  return (
    <div>
      <UserButton />
    </div>
  );
};

export default Header;
