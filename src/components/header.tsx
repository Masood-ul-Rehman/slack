"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import React from "react";

const Header = () => {
  const { signOut } = useAuthActions();

  return (
    <div>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default Header;
