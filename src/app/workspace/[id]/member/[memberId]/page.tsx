"use client";
import React, { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

import Conversation from "../components/conversation";
import ConversationHeader from "@/app/workspace/[id]/member/components/conversation-header";
import { useCreateOrGetConverstations } from "@/features/workspaces/api/conversationns/use-create-get-conversation";
import { useGetMemberById } from "@/features/workspaces/api/members/use-get-member-by-id";

const Member = () => {
  const { id, memberId } = useParams();
  const { mutate, isPending, data, isError } = useCreateOrGetConverstations();
  const { data: memberData, isLoading: isMemberLoading } = useGetMemberById({
    memberId: memberId as Id<"members">,
  });

  const createOrGetConversion = useCallback(() => {
    mutate({
      workspaceId: id as Id<"workspaces">,
      receiverId: memberId as Id<"members">,
    });
  }, [mutate, id, memberId]);
  useEffect(() => {
    createOrGetConversion();
  }, [createOrGetConversion]);

  if (isPending || isMemberLoading) {
    return (
      <div className="flex flex-col gap-4 h-full justify-center items-center">
        <Loader className="size-5 animate-spin transition-all duration-300" />
        <h4>Loading your chat</h4>
      </div>
    );
  }

  if (data?.error) {
    return <div>Error: {data.error}</div>;
  }
  if (data?.result === undefined) {
    return null;
  }
  return (
    <>
      <ConversationHeader
        memberName={
          Array.isArray(memberData?.result)
            ? ""
            : memberData?.result?.user?.name ?? ""
        }
        img={
          Array.isArray(memberData?.result)
            ? ""
            : memberData?.result?.user?.image ?? ""
        }
      />
      <Conversation conversationId={data?.result as Id<"conversations">} />
    </>
  );
};

export default Member;
