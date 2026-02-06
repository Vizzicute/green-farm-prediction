import {
  BlogStatus,
  CommentStatus,
  CommentType,
  PredictionStatus,
  SportType,
} from "@/generated/prisma";

export type MutationResponse = {
  status: number;
  message: string;
};

export type UserRole =
  | "admin"
  | "football_manager"
  | "basketball_manager"
  | "blog_manager"
  | "blog_staff"
  | "seo_manager"
  | "football_staff"
  | "basketball_staff"
  | "user";

export type Predictions = {
  id: string;
  subscriptionCategoryId: string | null;
  datetime: string;
  sport: SportType;
  league: string;
  tip: string;
  over: string;
  chance: string;
  htft: string;
  either: string;
  status: PredictionStatus | null;
  btts: boolean;
  banker: boolean;
  homescore: string | null;
  awayscore: string | null;
  createdAt: string;
  updatedAt: string;
  SubscriptionCategory: {
    id: string;
    name: string;
    minOdds: number;
    maxOdds: number;
    uniqueColor: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  odds: number;
  winProb: number;
  homeTeam: string;
  awayTeam: string;
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BlogStatus;
  featuredImage: string;
  authorId: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  }[];
  comments: Comment[];
};

export type Comment = {
  id: string;
  type: CommentType;
  userId: string | null;
  content: string;
  status: CommentStatus;
  blogId: string;
  guestName: string | null;
  guestEmail: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  blogs: {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: BlogStatus;
    featuredImage: string;
    authorId: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
};
