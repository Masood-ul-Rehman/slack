/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const Thumbnail = ({ url }: { url: string | null }) => {
  if (!url) return null;
  return (
    <div className="relative overflow-hidden max-w-[350px] border rounded-lg my-2 cursor-zoom-in ">
      <Dialog>
        <DialogTrigger>
          <img
            src={url}
            alt="Message"
            className="rounded-md object-cover size-full"
          />
        </DialogTrigger>
        <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
          <img
            src={url}
            alt="Message"
            className="rounded-md object-cover size-full"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Thumbnail;
