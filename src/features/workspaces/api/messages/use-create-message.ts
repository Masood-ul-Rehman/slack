import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
export const useCreateMessage = () => {
  const { mutate, isPending, isError, isSuccess, data } = useMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  });
  return { mutate, isPending, isError, isSuccess, data };
};
