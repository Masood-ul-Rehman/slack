import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.png";

import { Button } from "@/components/ui/button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

const NoWorkspaces = ({ name }: { name: string }) => {
  const [_open, setOpen] = useCreateWorkspaceModal();
  return (
    <div className="text-center pt-8 flex flex-col justify-start items-center h-full">
      <Image src={logo} alt="Logo" width={250} height={250} />
      <div className="flex flex-col items-center justify-center">
        <h4 className="font-bold mt-4 text-4xl">
          Welcome to Slack <br /> {name}
        </h4>
        <p className="text-sm mt-4">
          You don&apos;t have any workspaces yet, create a new one or join{" "}
          <br />
          existing one which someone created
        </p>
        <Button
          className="bg-slack_dark_bg text-white mt-8"
          onClick={() => setOpen(true)}
        >
          Create a new workspace
        </Button>
        <h4 className="mt-6">OR</h4>
        <Link href="/join">
          <Button variant="ghost" className="font-medium">
            Join an existing workspace
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NoWorkspaces;
