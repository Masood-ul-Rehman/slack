"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCreateOrGetConverstations } from "@/features/workspaces/api/conversationns/use-create-get-conversation";
import { Loader } from "lucide-react";

const Member = () => {
  const { id, memberId } = useParams();
  const { mutate, isPending, data } = useCreateOrGetConverstations();
  useEffect(() => {
    mutate({ workspaceId: id as any, receiverId: memberId as any });
  }, [mutate, id, memberId]);

  if (isPending)
    return (
      <div className=" flex flex-col  gap-4 h-full justify-center items-center">
        <Loader className="siz-5 animate-spin transition-all duration-300" />
        <h4>Loading your chat</h4>
      </div>
    );
  return <div>{JSON.stringify(data?.result)} this is the data</div>;
};

export default Member;
