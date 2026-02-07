import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import {
  adminCreatePrediction,
  adminDeletePrediction,
  adminGetPredictionById,
  adminUpdatePrediction,
  adminUpdatePredictionResult,
  getAdminPredictions,
  getAdminPredictionsCount,
} from "@/app/(protected)/admin/predictions/action";
import {
  subscriptionCategorySchema,
  subscriptionSchema,
} from "@/schema/subscription";
import {
  adminCreateSubscription,
  adminCreateSubscriptionCategory,
  adminDeleteSubscription,
  adminDeleteSubscriptionCategory,
  adminGetSubscriptionCategories,
  adminGetSubscriptions,
  adminGetSubscriptionsCount,
  adminUpdateSubscription,
  adminUpdateSubscriptionCategory,
  adminUpdateSubscriptionFreezeStatus,
} from "@/app/(protected)/admin/subscription/action";
import {
  predictionFilterSchema,
  predictionResultSchema,
  predictionSchema,
} from "@/schema/prediction";
import {
  BlogStatus,
  CommentStatus,
  CommentType,
  PredictionStatus,
} from "@/generated/prisma";
import {
  adminDeleteUser,
  adminGetUsers,
  adminGetUsersCount,
  adminUpdateUserActiveStatus,
  adminUpdateUserRole,
} from "@/app/(protected)/admin/users/action";
import {
  adminGetPageData,
  adminGetPagesData,
  adminUpdatePageData,
} from "@/app/(protected)/admin/pages/action";
import { pageDataSchema } from "@/schema/pages-data";
import {
  adminCreateBlogCategory,
  adminDeleteBlogCategory,
  adminGetBlogCategories,
  adminUpdateBlogCategory,
} from "@/app/(protected)/admin/blogs/_server/category-action";
import {
  adminCreateBlog,
  adminDeleteBlogPost,
  adminGetBlogPost,
  adminGetBlogPosts,
  adminGetBlogPostsCount,
  adminUpdateBlog,
  adminUpdateBlogStatus,
} from "@/app/(protected)/admin/blogs/_server/blog-action";
import { blogCategorySchema, blogSchema } from "@/schema/blog";
import {
  sendMailWithRecipientType,
  sendPredictionsToAllSubscribers,
} from "@/app/(protected)/admin/mails/_server/actions";
import { mailSchema } from "@/schema/mail";
import {
  adminGetSettingsByCategory,
  adminUpdateSettings,
} from "@/app/(protected)/admin/settings/action";
import {
  adminDeleteComment,
  adminGetComments,
  adminGetCommentsCount,
  adminUpdateCommentStatus,
} from "@/app/(protected)/admin/blogs/_server/comment-action";
import { getPredictions } from "@/app/(root)/_server/prediction";
import { getPageDataBySlug } from "@/app/(root)/_server/pagedata";
import { getBlogPost, getBlogPostBySlug, getBlogPosts } from "@/app/(root)/_server/blog";
import { notificationSchema } from "@/schema/notification";
import {
  getNotifications,
  getUnreadNotificationsCount,
  markAllAsReadMutation,
  markNotificationAsRead,
  newNotification,
} from "@/app/(protected)/admin/_server/notification";
import {
  getSubscriptionCategories,
  getSubscriptionCategory,
  getUserSubscriptions,
  upsertSubscription,
} from "@/app/(root)/_server/subscription";
import { getSettingsByCategory } from "@/app/(root)/_server/setting";
import {
  getBlogCategories,
  getBlogCategory,
  getBlogCategoryBySlug,
} from "@/app/(root)/blogs/_server/categories";
import { commentSchema } from "@/schema/comment";
import { addComment } from "@/app/(root)/blogs/_server/comments";
import { userSchema } from "@/schema/user";
import { updateProfile } from "@/app/(protected)/dashboard/_server/user";

export const appRouter = createTRPCRouter({
  // Create Operations (Mutations)
  adminCreateSubscriptionCategory: baseProcedure
    .input(subscriptionCategorySchema)
    .mutation(async (opts) => {
      const { name, minOdds, maxOdds, uniqueColor } = opts.input;
      return await adminCreateSubscriptionCategory(
        name,
        minOdds,
        maxOdds,
        uniqueColor!,
      );
    }),
  adminCreateSubscription: baseProcedure
    .input(subscriptionSchema)
    .mutation(async (opts) => {
      const { userId, duration, subscriptionCategoryId } = opts.input;
      return await adminCreateSubscription(
        userId,
        duration,
        subscriptionCategoryId,
      );
    }),
  adminAddPrediction: baseProcedure
    .input(predictionSchema)
    .mutation(async (opts) => await adminCreatePrediction(opts.input)),

  adminCreateBlog: baseProcedure
    .input(blogSchema)
    .mutation(async (opts) => await adminCreateBlog(opts.input)),

  adminCreateBlogCategory: baseProcedure
    .input(blogCategorySchema)
    .mutation(async (opts) => await adminCreateBlogCategory(opts.input)),

  newNotification: baseProcedure
    .input(notificationSchema)
    .mutation(async (opts) => await newNotification(opts.input)),

  upsertSubscription: baseProcedure
    .input(subscriptionSchema)
    .mutation(async (opts) => await upsertSubscription(opts.input)),

  addComment: baseProcedure
    .input(commentSchema)
    .mutation(async (opts) => await addComment(opts.input)),

  // Read Operations (Queries)

  getAdminPredictions: baseProcedure
    .input(
      z.object({
        filters: z.object({
          search: z.string().optional(),
          customEndDate: z.string().optional(),
          customStartDate: z.string().optional(),
          status: z.enum(PredictionStatus).optional(),
          subscriptionCategoryId: z.string().optional(),
        }),
        currentPage: z.number().min(1),
        pageSize: z.number().min(1),
      }),
    )
    .query(async (opts) => {
      return await getAdminPredictions(
        opts.input.filters,
        opts.input.pageSize,
        opts.input.currentPage,
      );
    }),

  adminGetUsers: baseProcedure
    .input(
      z.object({
        filters: z.object({
          search: z.string().optional(),
          role: z.string().optional(),
          customEndDate: z.string().optional(),
          customStartDate: z.string().optional(),
          active: z.boolean().optional(),
        }),
        currentPage: z.number().min(1),
        pageSize: z.number().min(1),
      }),
    )
    .query(async (opts) => {
      return await adminGetUsers(
        opts.input.filters,
        opts.input.pageSize,
        opts.input.currentPage,
      );
    }),

  adminGetUsersCount: baseProcedure
    .input(
      z.object({
        filters: z.object({
          search: z.string().optional(),
          role: z.string().optional(),
          active: z.boolean().optional(),
          subscription: z.boolean().optional(),
          customEndDate: z.string().optional(),
          customStartDate: z.string().optional(),
        }),
      }),
    )
    .query(async (opts) => {
      return await adminGetUsersCount(opts.input.filters);
    }),

  adminGetPredictionById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async (opts) => await adminGetPredictionById(opts.input.id)),

  getAdminPredictionsCount: baseProcedure
    .input(
      z.object({
        filters: z.object({
          search: z.string().optional(),
          customEndDate: z.string().optional(),
          customStartDate: z.string().optional(),
          status: z.enum(PredictionStatus).optional(),
          subscriptionCategoryId: z.string().optional(),
        }),
      }),
    )
    .query(async (opts) => {
      return await getAdminPredictionsCount(opts.input.filters);
    }),

  adminGetSubscriptionCategories: baseProcedure.query(
    async () => await adminGetSubscriptionCategories(),
  ),

  getSubscriptionCategories: baseProcedure
    .input(
      z.object({
        predictionFilters: predictionFilterSchema,
      }),
    )
    .query(async (opts) => await getSubscriptionCategories(opts.input.predictionFilters)),

  adminGetSubscriptions: baseProcedure
    .input(
      z.object({
        filters: z.object({
          search: z.string().optional(),
          category: z.string().optional(),
          isActive: z.boolean().optional(),
          isFreezed: z.boolean().optional(),
          customStartDate: z.string().optional(),
          customEndDate: z.string().optional(),
        }),
        currentPage: z.number().min(1),
        pageSize: z.number().min(1),
      }),
    )
    .query(async (opts) => {
      return await adminGetSubscriptions(
        opts.input.filters,
        opts.input.currentPage,
        opts.input.pageSize,
      );
    }),

  adminGetSubscriptionsCount: baseProcedure
    .input(
      z.object({
        filters: z.object({
          search: z.string().optional(),
          category: z.string().optional(),
          isActive: z.boolean().optional(),
          isFreezed: z.boolean().optional(),
          customStartDate: z.string().optional(),
          customEndDate: z.string().optional(),
        }),
      }),
    )
    .query(async (opts) => {
      return await adminGetSubscriptionsCount(opts.input.filters);
    }),

  getUserSubscriptions: baseProcedure
    .input(
      z.object({
        userId: z.string(),
        predictionFilters: predictionFilterSchema,
      }),
    )
    .query(
      async (opts) =>
        await getUserSubscriptions(
          opts.input.userId,
          opts.input.predictionFilters,
        ),
    ),

  getSubscriptionCategory: baseProcedure
    .input(z.string())
    .query(async (opts) => await getSubscriptionCategory(opts.input)),

  adminGetPagesData: baseProcedure.query(async () => adminGetPagesData()),

  adminGetPageData: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async (opts) => await adminGetPageData(opts.input.id)),

  getPageDataBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => await getPageDataBySlug(opts.input.slug)),

  getBlogPosts: baseProcedure
    .input(
      z.object({
        filters: z.object({
          search: z.string().optional(),
          status: z.enum(BlogStatus).optional(),
          customEndDate: z.string().optional(),
          customStartDate: z.string().optional(),
        }),
        page: z.number().min(1),
        pageSize: z.number().min(1),
      }),
    )
    .query(async (opts) => {
      return await getBlogPosts(
        opts.input.filters,
        opts.input.pageSize,
        opts.input.page,
      );
    }),

  getBlogPost: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async (opts) => getBlogPost(opts.input.id)),

  getBlogPostBySlug: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async (opts) => getBlogPostBySlug(opts.input.slug)),

  getBlogCategoryBySlug: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async (opts) => getBlogCategoryBySlug(opts.input.slug)),

  getBlogCategories: baseProcedure.query(async () => getBlogCategories()),

  getBlogCategory: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => getBlogCategory(opts.input.id)),

  adminGetBlogPosts: baseProcedure
    .input(
      z.object({
        filters: z.object({
          search: z.string().optional(),
          status: z.enum(BlogStatus).optional(),
          customEndDate: z.string().optional(),
          customStartDate: z.string().optional(),
        }),
        page: z.number().min(1),
        pageSize: z.number().min(1),
      }),
    )
    .query(async (opts) => {
      return await adminGetBlogPosts(
        opts.input.filters,
        opts.input.pageSize,
        opts.input.page,
      );
    }),

  adminGetBlogPost: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async (opts) => adminGetBlogPost(opts.input.id)),

  adminGetBlogPostsCount: baseProcedure
    .input(
      z.object({
        filters: z.object({
          search: z.string().optional(),
          status: z.enum(BlogStatus).optional(),
          customEndDate: z.string().optional(),
          customStartDate: z.string().optional(),
        }),
      }),
    )
    .query(async (opts) => {
      return await adminGetBlogPostsCount(opts.input.filters);
    }),

  adminGetBlogCategories: baseProcedure.query(async () =>
    adminGetBlogCategories(),
  ),

  adminGetSettingsByCategory: baseProcedure
    .input(z.object({ category: z.string() }))
    .query(
      async (opts) => await adminGetSettingsByCategory(opts.input.category),
    ),

  getSettingsByCategory: baseProcedure
    .input(z.object({ category: z.string() }))
    .query(async (opts) => await getSettingsByCategory(opts.input.category)),

  adminGetComments: baseProcedure
    .input(
      z.object({
        type: z.enum(CommentType),
        filters: z.object({
          search: z.string().optional(),
          status: z.enum(CommentStatus).optional(),
          customEndDate: z.string().optional(),
          customStartDate: z.string().optional(),
        }),
        pageSize: z.number().min(1),
        pageNumber: z.number().min(1),
      }),
    )
    .query(
      async (opts) =>
        await adminGetComments(
          opts.input.type,
          opts.input.filters,
          opts.input.pageSize,
          opts.input.pageNumber,
        ),
    ),

  adminGetCommentsCount: baseProcedure
    .input(
      z.object({
        type: z.enum(CommentType),
        filters: z.object({
          search: z.string().optional(),
          status: z.enum(CommentStatus).optional(),
          customEndDate: z.string().optional(),
          customStartDate: z.string().optional(),
        }),
      }),
    )
    .query(
      async (opts) =>
        await adminGetCommentsCount(opts.input.type, opts.input.filters),
    ),

  getPredictions: baseProcedure
    .input(
      z.object({
        filters: predictionFilterSchema,
        currentPage: z.number().min(1),
        pageSize: z.number().min(1),
      }),
    )
    .query(async (opts) => {
      return await getPredictions(
        opts.input.filters,
        opts.input.pageSize,
        opts.input.currentPage,
      );
    }),

  getNotifications: baseProcedure
    .input(
      z.object({
        id: z.string(),
        page: z.number(),
        pageSize: z.number(),
      }),
    )
    .query(
      async (opts) =>
        await getNotifications(
          opts.input.id,
          opts.input.pageSize,
          opts.input.page,
        ),
    ),

  getUnreadNotificationsCount: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async (opts) => await getUnreadNotificationsCount(opts.input.id)),

  // Update Operations (Mutations)

  adminUpdateSubscriptionCategory: baseProcedure
    .input(subscriptionCategorySchema)
    .mutation(async (opts) => {
      const { id, name, minOdds, maxOdds, uniqueColor } = opts.input;
      return await adminUpdateSubscriptionCategory(
        id!,
        name,
        minOdds,
        maxOdds,
        uniqueColor!,
      );
    }),

  adminUpdatePrediction: baseProcedure
    .input(predictionSchema)
    .mutation(async (opts) => await adminUpdatePrediction(opts.input)),

  adminUpdatePredictionResult: baseProcedure
    .input(predictionResultSchema)
    .mutation(async (opts) => await adminUpdatePredictionResult(opts.input)),

  adminUpdateUserRole: baseProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { id, role } = opts.input;
      return await adminUpdateUserRole(id, role);
    }),
  adminUpdateUserActiveStatus: baseProcedure
    .input(
      z.object({
        id: z.string(),
        active: z.boolean(),
      }),
    )
    .mutation(async (opts) => {
      const { id, active } = opts.input;
      return await adminUpdateUserActiveStatus(id, active);
    }),

  adminUpdateSubscription: baseProcedure
    .input(subscriptionSchema)
    .mutation(async (opts) => {
      const { id, userId, duration, subscriptionCategoryId } = opts.input;
      return await adminUpdateSubscription(
        id!,
        userId,
        duration,
        subscriptionCategoryId,
      );
    }),

  adminUpdateSubscriptionFreezeStatus: baseProcedure
    .input(
      z.object({
        id: z.string(),
        isFreezed: z.boolean(),
      }),
    )
    .mutation(async (opts) => {
      const { id, isFreezed } = opts.input;
      return await adminUpdateSubscriptionFreezeStatus(id, isFreezed);
    }),

  adminUpdatePageData: baseProcedure
    .input(pageDataSchema)
    .mutation(async (opts) => await adminUpdatePageData(opts.input)),

  adminUpdateBlog: baseProcedure
    .input(blogSchema)
    .mutation(async (opts) => adminUpdateBlog(opts.input)),
  adminUpdateBlogCategory: baseProcedure
    .input(blogCategorySchema)
    .mutation(async (opts) => adminUpdateBlogCategory(opts.input)),

  adminUpdateBlogStatus: baseProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(BlogStatus),
      }),
    )
    .mutation(
      async (opts) =>
        await adminUpdateBlogStatus(opts.input.id, opts.input.status),
    ),

  adminUpdateSettings: baseProcedure
    .input(
      z.object({
        id: z.string(),
        value: z.string(),
      }),
    )
    .mutation(
      async (opts) =>
        await adminUpdateSettings(opts.input.id, opts.input.value),
    ),

  adminUpdateCommentStatus: baseProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(CommentStatus),
      }),
    )
    .mutation(
      async (opts) =>
        await adminUpdateCommentStatus(opts.input.id, opts.input.status),
    ),

  updateProfile: baseProcedure
    .input(userSchema)
    .mutation(async (opts) => await updateProfile(opts.input)),

  markNotificationAsRead: baseProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => await markNotificationAsRead(opts.input.id)),

  markAllAsReadMutation: baseProcedure.mutation(
    async () => await markAllAsReadMutation(),
  ),

  // Delete Operations (Mutations)
  adminDeleteSubscriptionCategory: baseProcedure
    .input(z.string())
    .mutation(async (opt) => await adminDeleteSubscriptionCategory(opt.input)),

  adminDeletePrediction: baseProcedure
    .input(z.string())
    .mutation(async (opt) => await adminDeletePrediction(opt.input)),

  adminDeleteUser: baseProcedure
    .input(z.string())
    .mutation(async (opt) => await adminDeleteUser(opt.input)),

  adminDeleteSubscription: baseProcedure
    .input(z.string())
    .mutation(async (opt) => await adminDeleteSubscription(opt.input)),

  adminDeleteBlogPost: baseProcedure
    .input(z.string())
    .mutation(async (opt) => await adminDeleteBlogPost(opt.input)),

  adminDeleteBlogCategory: baseProcedure
    .input(z.string())
    .mutation(async (opt) => await adminDeleteBlogCategory(opt.input)),

  adminDeleteComment: baseProcedure
    .input(z.string())
    .mutation(async (opt) => await adminDeleteComment(opt.input)),

  // Third-party Integrations (Mutations)
  sendMailWithRecipientType: baseProcedure
    .input(mailSchema)
    .mutation(async (opts) => {
      const { recipientType, recipient, subscriptionId, subject, message } =
        opts.input;
      return await sendMailWithRecipientType({
        recipientType,
        recipient,
        subscriptionId,
        subject,
        message,
      });
    }),
  sendPredictionsToAllSubscribers: baseProcedure.mutation(
    async () => await sendPredictionsToAllSubscribers(),
  ),
});
// export type definition of API
export type AppRouter = typeof appRouter;
