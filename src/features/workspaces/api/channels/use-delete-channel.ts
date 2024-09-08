import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
export const useDeleteChannel = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: useConvexMutation(api.channels.deleteChannel),
  });
  return { mutate, isPending, data };
};
