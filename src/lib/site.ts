// Full site URL. Vercel sets VERCEL_PROJECT_PRODUCTION_URL; locally we use localhost.
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
