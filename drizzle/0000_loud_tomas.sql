CREATE SCHEMA IF NOT EXISTS "youtube_blog_ai";

CREATE TABLE IF NOT EXISTS "youtube_blog_ai"."articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"videoId" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"language" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "youtube_blog_ai"."transcripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"videoId" text NOT NULL,
	"transcript" text NOT NULL,
	"language" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "youtube_blog_ai"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"fullName" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- 既存の制約が存在しない場合のみ追加する
ALTER TABLE "youtube_blog_ai"."articles" ADD CONSTRAINT "articles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "youtube_blog_ai"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "youtube_blog_ai"."transcripts" ADD CONSTRAINT "transcripts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "youtube_blog_ai"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;