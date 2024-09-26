import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import WorkspaceAvatar from "../../../../../components/workspace-avater";

const ConversationHeader = ({
  memberName,
  img,
}: {
  memberName: string;
  img: string;
}) => {
  return (
    <div className="flex items-center gap-3  border-b border-gray-200  px-10 py-4">
      <WorkspaceAvatar
        img={img}
        name={memberName}
        styles="h-8 w-8 rounded-md"
      />
      <h4 className="text-lg font-bold">{memberName}</h4>
    </div>
  );
};

export default ConversationHeader;
