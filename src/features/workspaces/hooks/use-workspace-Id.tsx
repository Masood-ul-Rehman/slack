import { usePathname } from "next/navigation";

const useWorkspaceId = () => {
  const pathname = usePathname();
  const workspaceId = pathname.split("/")[2];
  return { workspaceId };
};

export default useWorkspaceId;
