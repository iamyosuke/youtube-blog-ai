'use client'

import { UserButton, SignInButton, useUser } from '@clerk/nextjs'

export function Header() {
  const { isSignedIn } = useUser()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-semibold text-gray-800">
          YouTube Blog AI
        </div>
        <div>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                ログイン
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}
