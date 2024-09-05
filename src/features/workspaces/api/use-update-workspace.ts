import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
export const useUpdateWorkspace = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.update),
  });
  return { mutate, isPending, data };
};
