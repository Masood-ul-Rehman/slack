"use client";

import React from "react";
import Sidebar from "./components/sidebar";
import Searchbar from "./components/searchbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-[100vh] ">
      <Searchbar />
      <div className="flex">
        <Sidebar />
        <div className="w-[calc(100vw-80px)] h-[calc(100vh-48px)] ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
