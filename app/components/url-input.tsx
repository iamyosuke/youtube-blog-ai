'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { extractVideoId, validateVideoId } from '../lib/api'
import { ErrorMessage } from './error-message'

type FormData = {
  url: string
}

export function URLInput() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const videoId = extractVideoId(data.url)
      
      if (!validateVideoId(videoId)) {
        throw new Error('無効なYouTube URLです')
      }

      // 字幕を取得
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: data.url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '字幕の取得に失敗しました');
      }

      const result = await response.json();
      console.log('Transcript:', result);
      
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div className="relative">
          <input
            {...register('url', {
              required: 'URLを入力してください',
              pattern: {
                value: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/,
                message: '有効なYouTube URLを入力してください'
              }
            })}
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '処理中...' : '生成'}
          </button>
        </div>
        {(errors.url || error) && (
          <ErrorMessage message={errors.url?.message || error || ''} />
        )}
      </div>
    </form>
  )
}
