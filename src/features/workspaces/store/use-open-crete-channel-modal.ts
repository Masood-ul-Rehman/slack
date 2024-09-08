import { atom, useAtom } from "jotai";
const modalState = atom(false);
export const useOpenCreateChannelModal = () => {
  return useAtom(modalState);
};
