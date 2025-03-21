'use client'

import { UserButton, SignInButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AuthButton() {
  return (
    <div>
      <UserButton />
    </div>
  )
}

export function SignInButtonComponent() {  // asyncを削除
  const { userId } = useAuth()  // awaitを削除
  const pathname = usePathname()
  const showSignInButton = !userId && pathname !== '/sign-up'

    return (
      showSignInButton && (
        <Link href="/sign-up">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            ログイン
          </button>
        </Link>
      )
    )
  }

