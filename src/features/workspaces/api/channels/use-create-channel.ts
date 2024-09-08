import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
export const useCreateChannel = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: useConvexMutation(api.channels.createChannel),
  });
  return { mutate, isPending, data };
};
