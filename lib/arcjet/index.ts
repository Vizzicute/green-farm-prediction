import { env } from "@/schema/env";
import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
} from "@arcjet/next";

export { detectBot, fixedWindow, protectSignup, sensitiveInfo };

export default arcjet({
  key: env.ARCJET_API_KEY,

  characteristics: ["fingerprint"],

  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});
