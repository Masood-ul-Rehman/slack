import React from "react";
import ChannelHeader from "./components/channel-header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ChannelHeader />
      {children}
    </div>
  );
};

export default layout;
