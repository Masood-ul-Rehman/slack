import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const generateWorkspaceId = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 8;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
export const generateChannelId = () => {
  const string = crypto.randomUUID();
  return string.replace(/-/g, "").split("").slice(0, 6).join("");
};

export const generateJoinCode = () => {
  const characters = "ABCDEFGHIJKLabcdefghijklmnopqrstuvwxyz012345";
  const length = 6;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
export const redirectToWorkspace = (
  router: AppRouterInstance,
  type: "signIn" | "signUp",
  data: any,
  isLoading: boolean
) => {
  if (type == "signIn") {
    if (data && data.result.length > 0 && !isLoading) {
      router.replace(`/workspace/${data.result[0].workspaceId}`);
    } else {
      router.replace("/get-started");
    }
  } else router.replace("/get-started");
};
export const captializeFirstLetter = (string: string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};
