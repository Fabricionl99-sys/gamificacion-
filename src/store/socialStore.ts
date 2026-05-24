import { create } from 'zustand';

interface SocialState {
  commentsPostId: string | null;
  feedRefreshKey: number;
  openComments: (postId: string) => void;
  closeComments: () => void;
  bumpFeed: () => void;
}

export const useSocialStore = create<SocialState>((set) => ({
  commentsPostId: null,
  feedRefreshKey: 0,
  openComments: (postId) => set({ commentsPostId: postId }),
  closeComments: () => set({ commentsPostId: null }),
  bumpFeed: () => set((state) => ({ feedRefreshKey: state.feedRefreshKey + 1 })),
}));
