import { adminGetSubscriptionCategory } from "../../subscription/action";
import { predictionsByCategory } from "../_server/actions";

export async function getPredictionMailContent(
  subscriber: any
): Promise<string> {
  const sections = await Promise.all(
    (subscriber.subscriptions ?? []).map(async (sub: any) => {
      const category = await adminGetSubscriptionCategory(
        sub.subscriptionCategoryId!
      );
      const predictions = await predictionsByCategory(
        sub.subscriptionCategoryId!
      );

      const rows = (predictions ?? [])
        .map(
          (prediction: any) => `
            <tr style="background-color: ${
              prediction.id % 2 === 0 ? "#f8f9fa" : "white"
            };">
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${new Date(
                prediction.datetime
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}</td>
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${
                prediction.league
              }</td>
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${
                prediction.homeTeam
              } VS ${prediction.awayTeam}</td>
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${
                prediction.tip
              }</td>
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${
                prediction.odds
              }</td>
            </tr>
          `
        )
        .join("");

      return `<div style="margin-bottom: 30px;">
      <h3 style="color: #718096; text-align: center; margin-bottom: 15px;">${category.name}</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #2e6f40; color: #ffffff">Time</th>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #2e6f40; color: #ffffff">League</th>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #2e6f40; color: #ffffff">Matches</th>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #2e6f40; color: #ffffff">Tips</th>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #2e6f40; color: #ffffff">Odds</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>`;
    })
  );

  return `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h2 style="color: #718096; text-align: center; margin-bottom: 20px;">Today's Predictions</h2>
          ${sections.join("")}
          <p style="text-align: center; color: #718096; font-size: 14px; margin-top: 20px;">
            Thank you for subscribing to our predictions!
          </p>
        </div>`;
}
