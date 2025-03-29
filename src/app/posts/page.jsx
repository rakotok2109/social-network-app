'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/clients'
import Link from 'next/link'
import CreatePostForm from '@/components/CreatePost'

export default function PostsPage() {
  const supabase = createClient()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        window.location.href = '/login'
      }
    }

    fetchUser()
  }, [])

  if (!user) {
    return null
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ajouter un message</h1>
      <CreatePostForm user={user} />
      <Link href={`/`} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {`Revenir à l'accueil`}</Link>
    </div>
  )
}
