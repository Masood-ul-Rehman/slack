import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
export const useCreateWorkspace = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.create),
  });
  return { mutate, isPending, isError, isSuccess };
};
