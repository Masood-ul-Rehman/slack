import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";

export const useDeleteMessage = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: useConvexMutation(api.messages.deleteMessage),
    onSuccess: () => {
      toast.success("Message deleted");
    },
    onError: (error) => {
      toast.error("Error deleting message");
    },
  });
  return { mutate, isPending, data };
};
