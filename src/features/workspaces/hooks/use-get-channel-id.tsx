import { usePathname } from "next/navigation";

const UseGetChannelId = () => {
  const path = usePathname();
  let channelId = path.split("/")[3];
  if (channelId?.length! > 6) channelId = "";
  return { channelId };
};

export default UseGetChannelId;
