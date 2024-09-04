import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
export const useUpdateWorkspaceName = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.updateName),
  });
  return { mutate, isPending, data };
};
