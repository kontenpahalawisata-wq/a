export type Platform = 'TikTok' | 'Instagram' | 'YouTube' | 'Threads' | 'Semua Platform';

export type ProductionStatus =
  | 'Ideation'
  | 'Scripting'
  | 'Take Konten'
  | 'Editing'
  | 'Scheduled'
  | 'Published';

export type MarketingFunnel = 'TOFU' | 'MOFU' | 'BOFU';

export type ApprovalStatus =
  | 'Draft'
  | 'Waiting Review'
  | 'Approved'
  | 'Revision'
  | 'Ready to Shoot';

export type ContentFormat =
  | 'Short Video'
  | 'Reels'
  | 'Carousel'
  | 'Single Post'
  | 'Long Video';

export interface ContentMetrics {
  views: number;
  likes: number;
  comments?: number;
  shares: number;
  saves: number;
  followersViews: number;
  nonFollowersViews: number;
  followerGrowth: number;
  avgWatchTime?: string;
  retentionRate?: string;
  engagementRate?: number;
}

export interface PlatformScheduleItem {
  date: string;
  time?: string;
}

export interface PlatformSchedules {
  instagram?: PlatformScheduleItem;
  tiktok?: PlatformScheduleItem;
  youtubeShorts?: PlatformScheduleItem;
  youtube?: PlatformScheduleItem;
}

export interface ContentItem {
  id: string;
  brandId: string;
  title: string;
  hookText: string;
  visualAngle: string;
  scriptText: string;
  caption: string;
  hashtags: string[];
  platform: Platform;
  format: ContentFormat;
  pillar: string;
  funnel: MarketingFunnel;
  status: ProductionStatus;
  approvalStatus: ApprovalStatus;
  publishDate: string; // YYYY-MM-DD
  publishTime?: string; // HH:mm
  platformSchedules?: PlatformSchedules;
  googleCalendarEventId?: string;
  googleCalendarLink?: string;
  pic: {
    name: string;
    email: string;
    role: string;
  };
  metrics?: ContentMetrics;
  referenceUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  handle: string;
  niche: string;
  color: string;
  logoInitial: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Head of Sosmed' | 'Scriptwriter' | 'Talent / Shooter' | 'Video Editor' | 'Creative Strategist';
  avatarInitials: string;
  assignedCount: number;
  joinedAt: string;
}
