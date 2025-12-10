import { MutationResponse } from "@/types";
import {
  adminGetSubscriptions,
} from "../../subscription/action";
import { adminGetUsers } from "../../users/action";
import { transporter } from "./config";
import { getAdminPredictions } from "../../predictions/action";
import { getPredictionMailContent } from "../_components/predictionMail";
import { RecipientType } from "../_types";
import { formattedDate } from "@/utils";

export async function sendMail(
  recipient: string,
  subject: string,
  message: string
) {
  const mailoptions = {
    to: recipient,
    subject,
    html: message,
  };

  await transporter.sendMail(mailoptions);
}

export async function sendBulkMail(
  recipients: string[],
  subject: string,
  html: string
) {
  const promises = recipients.map((to) => sendMail(to, subject, html));
  return Promise.all(promises);
}


export async function sendMailWithRecipientType(data: {
  recipientType: RecipientType;
  recipient?: string;
  subscriptionId?: string;
  subject: string;
  message: string;
}): Promise<MutationResponse> {
  if (data.recipientType === "single-user" && data.recipient)
  {
    await sendMail(data.recipient, data.subject, data.message);
    return { status: 200, message: "Email sent successfully" };
  }

  const to = await generateRecipients(data.recipientType, data.subscriptionId);

  if (to.length > 0) {
    if (to.length === 1) {
      await sendMail(to[0], data.subject, data.message);
      return { status: 200, message: "Email sent successfully" };
    }
    await sendBulkMail(to, data.subject, data.message);
  }
  return {
    status: 200,
    message: `Emails sent successfully to ${to.length} recipients`,
  };
}

async function generateRecipients(
  recipientType: RecipientType,
  subscriptionId?: string
): Promise<string[]> {
  let recipients: string[] = [];
  if (recipientType === "all-users") {
    const users = await adminGetUsers({ role: "user" }, 10000, 1);
    recipients = users.map((user) => user.email);
  }

  if (recipientType === "all-subscribers") {
    const subscribers = await adminGetSubscriptions(
      { isActive: true },
      10000,
      1
    );
    if (subscribers.length === 0) return [];
    recipients = subscribers.map((sub) => sub.User!.email);
  }

  if (recipientType === "non-subscribers") {
    const users = await adminGetUsers({ role: "user" }, 10000, 1);
    const subscribers = await adminGetSubscriptions(
      { isActive: true },
      10000,
      1
    );
    const subscriberEmails = new Set(subscribers.map((sub) => sub.User!.email));
    recipients = users
      .filter((user) => !subscriberEmails.has(user.email))
      .map((user) => user.email);
  }

  if (recipientType === "with-subscription-type" && subscriptionId) {
    const subscribers = await adminGetSubscriptions(
      { category: subscriptionId, isActive: true },
      10000,
      1
    );
    if (subscribers.length === 0) return [];
    recipients = subscribers.map((sub) => sub.User!.email);
  }

  return recipients;
}

export async function sendPredictionsToAllSubscribers(): Promise<MutationResponse> {
  try {
    const subscribers = await adminGetUsers({ subscription: true }, 10000, 1);
    const activeSubscribers = subscribers.filter((sub) =>
      sub.subscriptions?.some((s) => s.isActive && s.isFreezed === false)
    );
    if (activeSubscribers.length === 0)
      return {
        status: 404,
        message: "No active subscribers found",
      };

    const subscriberscount = activeSubscribers.length;

    activeSubscribers.forEach(async (subscriber) => {
      const message = await getPredictionMailContent(subscriber);
      const subject = "Today's Predictions";
      await sendMail(subscriber.email, subject, message);
    });
    return {
      status: 200,
      message:
        "Emails sent successfully to " + subscriberscount + " subscribers",
    };
  } catch {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function predictionsByCategory(categoryId: string) {
  const prediction = await getAdminPredictions(
    {
      subscriptionCategoryId: categoryId,
      customStartDate: formattedDate(new Date()),
      customEndDate: formattedDate(new Date()),
    },
    100,
    1
  );
  if (prediction.length === 0) return null;
  return prediction;
}
