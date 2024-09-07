"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import logo from "@/app/assets/logo.png";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import InviteCodeInput from "../../components/invite-code-input";
const Join = () => {
  const router = useRouter();
  const { workspaceId, inviteId } = useParams();

  const { mutate, isPending } = useJoinWorkspace();
  const [invalidInvite, setInvalidInvite] = useState(false);

  useEffect(() => {
    if (workspaceId.length === 8 && inviteId.length >= 6) {
      setInvalidInvite(false);
    } else {
      router.replace("/join");
      toast.error("Invalid invite code", {
        description: "Please check the invite code and try again",
      });
    }
  }, [workspaceId, inviteId, router]);

  return (
    <div className="flex flex-col ">
      {invalidInvite ? (
        <div className="flex justify-center flex-col gap-4  items-center ">
          <h4 className="text-muted-foreground">Invalid invite code</h4>
        </div>
      ) : (
        <>
          <InviteCodeInput code={inviteId as string} />
        </>
      )}
    </div>
  );
};

export default Join;
