import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useCreateOrGetConverstations = () => {
  const { mutate, isPending, isError, isSuccess, data } = useMutation({
    mutationFn: useConvexMutation(api.converstaions.createOrGetConversation),
  });
  return { mutate, isPending, isError, isSuccess, data };
};
