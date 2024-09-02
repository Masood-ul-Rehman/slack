import { usePathname } from "next/navigation";

const UseGetId = () => {
  const pathname = usePathname();
  const workspaceId = pathname.split("/")[2];
  return { workspaceId };
};

export default UseGetId;
