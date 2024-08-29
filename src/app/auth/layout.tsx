import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex max-h-screen flex-col items-center justify-center ">
      {children}
    </div>
  );
};

export default layout;
