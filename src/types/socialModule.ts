export type SocialPrivacyMode = 'public' | 'followers_only' | 'private';

export interface SocialCursorPage<T> {
  items: T[];
  next_cursor: string | null;
}

export interface SocialProfileMe {
  id: string;
  tenant_id: string;
  player_state_id: string;
  privacy_mode: SocialPrivacyMode;
  display_name_override: string | null;
  bio: string | null;
  is_banned_social: boolean;
  banned_at: string | null;
  banned_by_user_id: string | null;
  banned_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialProfilePublic {
  player_state_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  privacy_mode: SocialPrivacyMode;
  follower_count: number;
  following_count: number;
  post_count: number;
  is_following: boolean;
  follow_request_pending: boolean;
  is_blocked_by_viewer: boolean;
}

export interface SocialPost {
  id: string;
  author_id: string;
  author_display_name: string;
  author_avatar_url: string | null;
  content: string;
  like_count: number;
  comment_count: number;
  created_at: string;
  viewer_has_liked: boolean;
}

export interface SocialComment {
  id: string;
  author_id: string;
  author_display_name: string;
  author_avatar_url: string | null;
  content: string;
  created_at: string;
}

export interface SocialFollowRequest {
  id: string;
  follower_id: string;
  follower_display_name: string;
  follower_avatar_url: string | null;
  created_at: string;
}

export interface SocialBlockedUser {
  player_state_id: string;
  display_name: string;
  avatar_url: string | null;
  blocked_at: string;
}

export interface UpdateSocialProfileInput {
  privacy_mode?: SocialPrivacyMode;
  bio?: string | null;
  display_name_override?: string | null;
}

export interface LikePostResult {
  liked: boolean;
  like_count: number;
}

export interface UnlikePostResult {
  unliked: boolean;
  like_count: number;
}

export interface FollowResult {
  id: string;
  status: 'accepted' | 'pending';
}
