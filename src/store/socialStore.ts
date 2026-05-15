import { create } from 'zustand';

interface SocialState {
  commentsPostId: string | null;
  feedRefreshKey: number;
  postComposerMode: 'thought' | 'bet_ticket';
  openComments: (postId: string) => void;
  closeComments: () => void;
  bumpFeed: () => void;
  setPostComposerMode: (mode: 'thought' | 'bet_ticket') => void;
}

export const useSocialStore = create<SocialState>((set) => ({
  commentsPostId: null,
  feedRefreshKey: 0,
  postComposerMode: 'thought',
  openComments: (postId) => set({ commentsPostId: postId }),
  closeComments: () => set({ commentsPostId: null }),
  bumpFeed: () => set((state) => ({ feedRefreshKey: state.feedRefreshKey + 1 })),
  setPostComposerMode: (mode) => set({ postComposerMode: mode }),
}));
