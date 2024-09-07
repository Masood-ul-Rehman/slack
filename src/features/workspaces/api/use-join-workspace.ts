import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useJoinWorkspace = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.join),
  });
  return { mutate, isPending, data };
};
