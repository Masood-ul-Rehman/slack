import { atom, useAtom } from "jotai";
const chanelState = atom("");
export const useSetChannel = () => {
  return useAtom(chanelState);
};
