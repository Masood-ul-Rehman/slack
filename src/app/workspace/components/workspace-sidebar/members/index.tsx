import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";
import { useGetWorkspaceMembers } from "@/features/workspaces/api/members/use-get-members-by-workspace-id";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import WorkspaceAvatar from "@/components/workspace-avater";
const Members = () => {
  const { workspaceId } = useWorkspaceId();
  const { data: members, isLoading } = useGetWorkspaceMembers({
    workspaceId,
  });
  const [showMembers, setShowMembers] = useState(false);
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
        <div className="flex flex-col gap-2 px-3 mt-2  ">
          {members?.result.map((member) => (
            <div
              key={member._id}
              className="flex items-center gap-4 hover:bg-accent/20 rounded-md p-1 cursor-pointer"
            >
              <WorkspaceAvatar
                img={member.user.image}
                name={member.user.name}
                styles="h-5 w-5 rounded-md text-xs"
              />
              <h4 className="text-sm text-[#f9edffc] truncate">
                {member.user.name}
              </h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Members;
