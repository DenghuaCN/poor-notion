import { create } from "zustand";

type CoverImageStore = {
  replaceUrl?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onReplace: (url: string) => void;
}

export const useCoverImage = create<CoverImageStore>((set) => {
  return {
    replaceUrl: undefined,
    isOpen: false,
    onOpen: () => set({ isOpen: true,replaceUrl: undefined }),
    onClose: () => set({ isOpen: false, replaceUrl: undefined }),
    onReplace: (url: string) => set({ replaceUrl: url, isOpen: true }) // 接受新的图片url并打开modal
  }
})