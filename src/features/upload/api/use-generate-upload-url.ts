import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
export const useGenerateUploadUrl = () => {
  const { mutate, isPending, isError, isSuccess, data } = useMutation({
    mutationFn: useConvexMutation(api.upload.generateUploadUrl),
  });
  return { mutate, isPending, isError, isSuccess, data };
};
