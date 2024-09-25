"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

import Conversation from "../components/conversation";
import { useCreateOrGetConverstations } from "@/features/workspaces/api/conversationns/use-create-get-conversation";

const Member = () => {
  const { id, memberId } = useParams();
  const { mutate, isPending, data, isError } = useCreateOrGetConverstations();
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (hasCalledRef.current) return;

    const createOrGetConversion = () => {
      mutate({
        workspaceId: id as Id<"workspaces">,
        receiverId: memberId as Id<"members">,
      });
    };

    createOrGetConversion();
    if (data?.result) {
      setConversationId(data.result as Id<"conversations">);
    }
    hasCalledRef.current = true;
    console.log("ended");
  }, [id, memberId, mutate, data]);

  // useEffect(() => {
  //   hasCalledRef.current = false;
  // }, [memberId]);

  console.log(data, isPending, isError, "data");
  if (isPending) {
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
  return (
    <Conversation conversationId={conversationId as Id<"conversations">} />
  );
};

export default Member;
