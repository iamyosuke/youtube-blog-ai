-- 既存のデータを一時的に保存
ALTER TABLE "youtube_blog_ai"."transcripts" ADD COLUMN "transcript_temp" jsonb;
UPDATE "youtube_blog_ai"."transcripts" SET "transcript_temp" = "transcript"::jsonb WHERE "transcript" IS NOT NULL;

-- 元のカラムを削除して新しいカラムを追加
ALTER TABLE "youtube_blog_ai"."transcripts" DROP COLUMN "transcript";
ALTER TABLE "youtube_blog_ai"."transcripts" ADD COLUMN "transcript" jsonb;

-- データを戻す
UPDATE "youtube_blog_ai"."transcripts" SET "transcript" = "transcript_temp";
ALTER TABLE "youtube_blog_ai"."transcripts" DROP COLUMN "transcript_temp";