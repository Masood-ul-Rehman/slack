import React from "react";
import ChannelHeader from "./components/channel-header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <ChannelHeader />
      {children}
    </div>
  );
};

export default layout;
