import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useGetMemberById = ({ memberId }: { memberId: Id<"members"> }) => {
  const data = useQuery(api.members.getByMemberId, { memberId });
  const isLoading = data === undefined;
  return { isLoading, data };
};
