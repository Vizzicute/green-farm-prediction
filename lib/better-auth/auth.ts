import { betterAuth } from "better-auth";
import { admin, emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";
import { env } from "@/schema/env";
import { resend } from "../resend";
import { EmailVerificationTemplate } from "@/components/email-template/verify-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  socialProviders: {
    google: {
      prompt: "select_account consent",
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const { data, error } = await resend.emails.send({
          from: "Green Farm Prediction <onboarding@resend.dev>",
          to: [email],
          subject: "Verify your email - Green Farm Prediction",
          react: EmailVerificationTemplate({ email, otp }),
        });
      },
    }),
    admin(),
  ],
});
