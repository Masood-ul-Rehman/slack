import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";

export const useEditMessage = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: useConvexMutation(api.messages.updateMessage),
    onSuccess: () => {
      toast.success("Message updated");
    },
    onError: (error) => {
      toast.error("Error updating message");
    },
  });
  return { mutate, isPending, data };
};
