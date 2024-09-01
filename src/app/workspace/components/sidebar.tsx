"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import UserButton from "@/features/auth/components/user-button";
import HomeNormal from "@/components/icons/home-normal";
import HomeFilled from "@/components/icons/home-filled";
import DmFilled from "@/components/icons/dm-filled";
import DmNormal from "@/components/icons/dm-normal";
import ActivityFilled from "@/components/icons/activity-filled";
import ActivityNormal from "@/components/icons/activity-normal";
import More from "@/components/icons/more";
import LaterNormal from "@/components/icons/later-normal";
import LaterFilled from "@/components/icons/latter-filled";
import UserWorkspaces from "./user-workspaces";

const Sidebar = () => {
  const pathname = usePathname();
  const [selected, setSelected] = useState<
    "home" | "dms" | "activity" | "later" | "more"
  >("home");
  useEffect(() => {
    const currentpath = pathname.split("/");
    if (currentpath[3]) {
      if (currentpath[3] == "dms") setSelected("dms");
      else if (currentpath[3] == "activity") setSelected("activity");
      else if (currentpath[3] == "later") setSelected("later");
      else if (currentpath[3] == "more") setSelected("more");
    }
  }, [pathname]);
  return (
    <div className="bg-slack_dark_bg w-[80px] text-white h-[calc(100vh-36px)] py-6 px-2 flex flex-col justify-between items-center">
      <div className="flex flex-col  gap-4">
        <UserWorkspaces />
        <div className="mt-4 flex flex-col items-center gap-2 cursor-pointer">
          <div
            className={cn(selected == "home" && "bg-accent/20 p-2  rounded-lg")}
          >
            <div className="w-5 h-5">
              {selected == "home" ? <HomeFilled /> : <HomeNormal />}
            </div>
          </div>
          <h4 className="text-xs font-bold">Home</h4>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2 cursor-pointer">
          <div
            className={cn(selected == "dms" && "bg-accent/20 p-2  rounded-lg")}
          >
            <div className="w-5 h-5">
              {selected == "dms" ? <DmFilled /> : <DmNormal />}
            </div>
          </div>
          <h4 className="text-xs font-bold">DMs</h4>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2 cursor-pointer">
          <div
            className={cn(
              selected == "activity" && "bg-accent/20 p-2  rounded-lg"
            )}
          >
            <div className="w-5 h-5">
              {selected == "activity" ? <ActivityFilled /> : <ActivityNormal />}
            </div>
          </div>
          <h4 className="text-xs font-bold">Activity</h4>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 cursor-pointer">
          <div
            className={cn(
              selected == "later" && "bg-accent/20 p-2  rounded-lg"
            )}
          >
            <div className="w-5 h-5">
              {selected == "later" ? <LaterFilled /> : <LaterNormal />}
            </div>
          </div>
          <h4 className="text-xs font-bold">Later</h4>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2 cursor-pointer">
          <div
            className={cn(selected == "more" && "bg-accent/20 p-2  rounded-lg")}
          >
            <div className="w-5 h-5">
              <More />
            </div>
          </div>
          <h4 className="text-xs font-bold">More</h4>
        </div>
      </div>
      <UserButton />
    </div>
  );
};

export default Sidebar;
