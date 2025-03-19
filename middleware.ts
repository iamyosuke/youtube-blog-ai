import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // 公開ルート（認証不要）
  publicRoutes: [
    "/",
    "/api/health",
    "/api/webhook"
  ],
  // 無視するルート（認証チェックをスキップ）
  ignoredRoutes: [
    "/api/webhook(.*)"
  ]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
