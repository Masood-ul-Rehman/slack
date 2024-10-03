import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaCaretDown } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";
import { useGetWorkspaceMembers } from "@/features/workspaces/api/members/use-get-members-by-workspace-id";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import WorkspaceAvatar from "@/components/workspace-avater";
import { useGetUserNotifications } from "@/features/notifications/api/get-user-notifications";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { useGetCurrentMember } from "@/features/workspaces/api/members/use-current-member";

const Members = () => {
  const { memberId } = useParams();
  const { workspaceId } = useWorkspaceId();
  const { data: members, isLoading } = useGetWorkspaceMembers({
    workspaceId,
  });
  const [showMembers, setShowMembers] = useState(false);
  const { data: user } = useGetCurrentMember({ workspaceId });

  const { data: notifications } = useGetUserNotifications({
    workspaceId,
    memberId: memberId as Id<"members">,
  });
  const memberNotifications = (id: string) => {
    return notifications?.filter(
      (notification) => notification.notificationFrom === id
    );
  };
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center gap-1 px-3">
        <Button
          variant={"transparent"}
          className=" px-1 py-1 hover:py-1 h-fit text-[#f9edffc] shrink-0 text-sm "
          onClick={() => setShowMembers(!showMembers)}
        >
          <FaCaretDown
            size={16}
            className={`transition-transform duration-300 ${
              showMembers ? "-rotate-90" : ""
            }`}
          />
        </Button>
        <div className="flex items-center justify-between w-full group relative">
          <Button
            variant={"transparent"}
            className="px-2 py-1 hover:py-1 h-fit text-[#f9edffc] shrink-0 text-sm  font-medium"
          >
            Direct Messages
          </Button>
          <div className="flex items-center bg-accent/20 rounded-md p-1 opacity-0 group-hover:opacity-100 cursor-pointer">
            <Plus size={12} />
          </div>
        </div>
      </div>
      {!isLoading && (
        <div className="flex flex-col gap-2 px-2 mt-2  ">
          {members?.result.map((member) => {
            let notification = memberNotifications(member._id);
            return (
              <Link
                href={`/workspace/${workspaceId}/member/${member._id}`}
                key={member._id}
                className={`flex items-center gap-4 hover:bg-accent/20  w-full rounded-md p-1 cursor-pointer px-2 ${
                  memberId === member._id ? "bg-accent/20" : ""
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <WorkspaceAvatar
                    img={member.user.image}
                    name={member.user.name}
                    styles="h-5 w-5 rounded-md text-xs"
                  />
                  <h4 className="text-sm text-[#f9edffc] truncate">
                    {member.user.name}
                  </h4>
                </div>
                {notification &&
                  notification?.length > 0 &&
                  notification.some(
                    (notification: any) => !notification.read
                  ) && (
                    <Badge className="bg-accent/30 text-accent">
                      {notification?.length > 9 ? `9+` : notification?.length}
                    </Badge>
                  )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Members;
