ALTER TABLE "youtube_blog_ai"."articles" DROP CONSTRAINT "articles_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "youtube_blog_ai"."transcripts" DROP CONSTRAINT "transcripts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "youtube_blog_ai"."articles" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "youtube_blog_ai"."transcripts" ALTER COLUMN "userId" SET DATA TYPE text;