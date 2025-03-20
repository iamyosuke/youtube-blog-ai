'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from './error-message'
import { getYouTubeTranscriptAction } from '../(server)/actions/getYouTubeTranscriptAction'

type UrlFormData = {
  url: string
}

export function URLInput() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<UrlFormData>()



  return (
    <form action={async (formData: FormData) => {
      setIsLoading(true)
      const result = await getYouTubeTranscriptAction(formData)
      if (result.success) {
        setIsLoading(false)
      } else {
        setError(result.error?.message || 'エラーが発生しました')
        setIsLoading(false)
      }
    }} className="space-y-4">
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