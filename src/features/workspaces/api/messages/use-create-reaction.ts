import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";
export const useCreateReaction = () => {
  const { mutate, isPending, isError, isSuccess, data } = useMutation({
    mutationFn: useConvexMutation(api.reactions.addReaction),
    onError: (error) => {
      toast.error("Failed to add reaction", {
        description: error.message,
      });
    },
  });
  return { mutate, isPending, isError, isSuccess, data };
};
