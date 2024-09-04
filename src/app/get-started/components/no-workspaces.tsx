import React from "react";
import Image from "next/image";
import logo from "@/app/assets/logo.png";

import { Button } from "@/components/ui/button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

const NoWorkspaces = ({ name }: { name: string }) => {
  const [_open, setOpen] = useCreateWorkspaceModal();
  return (
    <div className="text-center pt-8 flex flex-col justify-center items-center">
      <Image src={logo} alt="Logo" width={150} height={150} />
      <div className="flex flex-col items-center justify-center">
        <h4 className="font-bold mt-8 text-xl">Welcome {name}</h4>
        <p>You don&apos;t have any workspaces yet</p>
        <Button
          className="bg-slack_dark_bg text-white mt-4"
          onClick={() => setOpen(true)}
        >
          Create a new workspace
        </Button>
      </div>
    </div>
  );
};

export default NoWorkspaces;
