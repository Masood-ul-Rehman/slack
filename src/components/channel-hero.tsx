import React from "react";
import { format } from "date-fns";

interface ChannelHeroProps {
  channelName: string | undefined;
  channelCreatedAt: Date | undefined;
}

const ChannelHero = ({ channelName, channelCreatedAt }: ChannelHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <p className="text-2xl font-bold "># {channelName}</p>
      <p className="text-sm text-muted-foreground">
        This channel was created at{" "}
        {channelCreatedAt &&
          format(new Date(channelCreatedAt), "MMMM do, yyyy")}
        . This is very beginning of <b>{channelName}</b> chat.
      </p>
    </div>
  );
};

export default ChannelHero;
