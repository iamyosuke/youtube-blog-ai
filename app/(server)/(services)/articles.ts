'server only'
import db from '@/app/db';
import { articles, transcripts } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import type { NewArticle, Article, Transcript } from '@/lib/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini APIの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * 字幕から記事を生成して保存する
 */
export const generateAndSaveArticle = async (userId: string, videoId: string, language: string = 'ja'): Promise<Article> => {
  try {
    // 字幕を取得
    const [transcriptData] = await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.videoId, videoId))
      .limit(1);

    if (!transcriptData) {
      throw new Error('字幕が見つかりません');
    }

    // 字幕テキストを結合
    const transcriptContent = (transcriptData.transcript as { text: string }[])
      .map(segment => segment.text)
      .join('\n');

    // Geminiモデルを設定
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // プロンプトを作成
    const prompt = `以下のYouTube動画の字幕から、ブログ記事を生成してください。
字幕の内容を要約し、適切な見出しをつけて、読みやすい記事にしてください。
見出しはh1, h2, h3などのHTMLタグを使用してください。
段落はpタグで囲んでください。
重要な部分はstrongタグで強調してください。

字幕内容：
${transcriptContent}

出力形式：
{
  "title": "記事のタイトル",
  "content": "記事の本文（HTML形式）"
}

出力例：
{
  "title": "タイトル例",
  "content": "<article><h1>メインタイトル</h1><p>導入文...</p><h2>セクション1</h2><p>本文...<strong>重要なポイント</strong>...</p></article>"
}`;

    // 記事を生成
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // レスポンステキストからJSONを抽出して正規化
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('生成された記事のフォーマットが不正です');
    }
    
    // 抽出したテキストを正規化
    let jsonText = jsonMatch[0]
      // 改行を削除
      .replace(/\n/g, ' ')
      // 連続する空白を1つに
      .replace(/\s+/g, ' ')
      // HTMLタグ内の余分な空白を削除
      .replace(/>\s+</g, '><')
      // 特殊文字をエスケープ
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

    console.log('Normalized JSON:', jsonText);
    
    try {
      // JSONをパース
      const article = JSON.parse(jsonText);
      
      // 必要なプロパティの存在チェック
      if (!article.title || !article.content) {
        throw new Error('記事のタイトルまたは本文が見つかりません');
      }
      
      // 記事を保存
      const createdArticle = await saveArticle({
        userId,
        videoId,
        transcriptId: transcriptData.id,
        title: article.title,
        content: article.content,
        language,
      });

      return createdArticle;
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('Raw JSON Text:', jsonText);
      throw new Error('記事の生成結果を解析できませんでした: ' + (error as Error).message);
    }
  } catch (error) {
    console.error('Error generating article:', error);
    throw error;
  }
};

/**
 * 記事を保存する
 */
export const saveArticle = async (data: NewArticle): Promise<Article> => {
  try {
    const [article] = await db
      .insert(articles)
      .values({
        ...data,
        transcriptId: data.transcriptId
      })
      .returning();
    
    return article;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

/**
 * 記事一覧を取得する
 */
export const getArticles = async (userId: string): Promise<Article[]> => {
  try {
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.userId, userId));
    
    return result;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

/**
 * 記事を取得する
 */
export const getArticle = async (id: string): Promise<Article | null> => {
  try {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    
    return article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};
