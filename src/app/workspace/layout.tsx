"use client";
import { useEffect } from "react";

import Sidebar from "./components/sidebar";
import Searchbar from "./components/searchbar";
import { useRouter } from "next/navigation";
import { useGetSession } from "@/features/users/api/use-get-session";

const layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data, isLoading } = useGetSession();

  useEffect(() => {
    if (isLoading) return;
    if (data?.result?.userId) return;
    if (data?.error == "Session not found") router.replace("/auth/signin");
  }, [data]);
  return (
    <div className="flex flex-col h-[100vh] ">
      <Searchbar />
      <div className="flex">
        <Sidebar />
        <div className="w-[calc(100vw-80px)] h-[calc(100vh-36px)] ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
