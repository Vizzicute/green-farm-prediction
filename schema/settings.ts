import z from "zod";

export const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.string().min(1, "SMTP port is required"),
  smtpUser: z.string().email("Invalid Email Username"),
  smtpPass: z.string().min(1, "SMTP password is required"),
  smtpFrom: z.string().min(1, "Invalid email address"),
});

export const socialLinksSchema = z.object({
  telegram: z.string().url("Invalid Telegram URL").optional(),
  whatsapp: z.string().url("Invalid WhatsApp URL").optional(),
  facebook: z.string().url("Invalid Facebook URL").optional(),
  twitter: z.string().url("Invalid Twitter URL").optional(),
  instagram: z.string().url("Invalid Instagram URL").optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  youtube: z.string().url("Invalid YouTube URL").optional(),
  supportEmail: z.string().email("Invalid support email"),
  infoEmail: z.string().email("Invalid info email"),
  advertEmail: z.string().email("Invalid advert email"),
});

export const googleTagSettingsSchema = z.object({
  gaMeasurementId: z
    .string()
    .min(1, "Google Analytics Measurement ID is required"),
  gtmId: z.string().min(1, "Google Tag Manager ID is required"),
  adsenseId: z.string().min(1, "Google Adsense ID is required"),
});

export const walletSettingsSchema = z.object({
  // Paystack Settings
  paystack: z.object({
    publicKey: z.string().min(1, "Public key is required"),
    secretKey: z.string().min(1, "Secret key is required"),
    webhookSecret: z.string().optional(),
  }),

  // Bank Account Details
  bankAccount: z.object({
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    bankName: z.string().min(1, "Bank name is required"),
    swiftCode: z.string().optional(),
    routingNumber: z.string().optional(),
  }),

  // USD Bank Account Details
  usdBankAccount: z.object({
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    bankName: z.string().min(1, "Bank name is required"),
    swiftCode: z.string().min(1, "SWIFT code is required"),
    routingNumber: z.string().min(1, "Routing number is required"),
  }),

  // Mobile Money Details
  mobileMoney: z.object({
    provider: z.string().min(1, "Provider is required"),
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
  }),

  // Crypto Details
  crypto: z.object({
    bitcoin: z.object({
      address: z.string().min(1, "Bitcoin address is required"),
      network: z.string().default("Bitcoin"),
    }),
    ethereum: z.object({
      address: z.string().min(1, "Ethereum address is required"),
      network: z.string().default("Ethereum"),
    }),
    usdt: z.object({
      address: z.string().min(1, "USDT address is required"),
      network: z.string().default("TRC20"),
    }),
  }),
});

export const priceSchema = z.object({
  subscriptionCategoryId: z.string(),
  ratio: z.number(),
})

export const currencyDiscountSchema = z.object({
  currencyCode: z.string(),
  D10: z.number().min(0).max(99),
  D20: z.number().min(0).max(99),
  D30: z.number().min(0).max(99),
});


export type EmailSettings = z.infer<typeof emailSettingsSchema>;
export type SocialLinksSettings = z.infer<typeof socialLinksSchema>;
export type GoogleTagSettings = z.infer<typeof googleTagSettingsSchema>;
export type WalletSettings = z.infer<typeof walletSettingsSchema>;
export type Price = z.infer<typeof priceSchema>;
export type CurrencyDiscount = z.infer<typeof currencyDiscountSchema>;