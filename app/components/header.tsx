import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { AuthButton, SignInButtonComponent } from './auth-button'

export async function Header() {
  const { userId } = await auth()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-gray-800 hover:text-gray-600 transition-colors">
          YouTube Blog AI
        </Link>
        <div>
          {userId ? (
            <AuthButton />
          ) : (
            <SignInButtonComponent />
          )}
        </div>
      </div>
    </header>
  )
}
