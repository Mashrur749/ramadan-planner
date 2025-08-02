import posthog from "posthog-js";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
if (!posthogKey) {
  throw new Error("NEXT_PUBLIC_POSTHOG_KEY is not defined");
}
posthog.init(posthogKey, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
});
