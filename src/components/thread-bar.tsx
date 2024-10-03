import React from "react";
import WorkspaceAvatar from "./workspace-avater";
import { formatDistanceToNow } from "date-fns";

const ThreadBar = ({
  count,
  image,
  timeStamp,
  onClick,
}: {
  count: number;
  image: string;
  timeStamp: Date;
  onClick: () => void;
}) => {
  if (!image || !count || !timeStamp) return null;
  return (
    <button
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-start group/thread-bar max-w-[600px]"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <WorkspaceAvatar img={image} styles="w-5 h-5 rounded-sm" />
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          Last reply{" "}
          {formatDistanceToNow(new Date(timeStamp), { addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
    </button>
  );
};

export default ThreadBar;
