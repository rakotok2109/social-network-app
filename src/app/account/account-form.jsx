'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/clients'
import Link from 'next/link'
import Avatar from './avatar'

export default function AccountForm({ user }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`fullname, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.fullname)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'
    } else {
      getProfile()
    }
  }, [user, getProfile]) 

  async function updateProfile({ fullname, username, website, avatar_url }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) {
        console.error('Erreur lors de la mise à jour du profil :', error)
        throw error
      }
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="form-widget max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <Avatar
        uid={user?.id}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ fullname, username, website, avatar_url: url })
        }}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="text"
          value={user?.email}
          disabled
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-gray-100"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="fullname"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          id="fullname"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-700"
        >
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          className={`button primary block bg-blue-500 text-white rounded-md px-4 py-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() =>
            updateProfile({ fullname, username, website, avatar_url })
          }
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div className="text-center">
        <Link
          href={`/`}
          className="text-sm font-semibold text-blue-500 hover:underline"
        >
          {`Accueil`}
        </Link>
      </div>

      <div className="text-center mt-4">
        <form action="../auth/signout" method="post">
          <button
            className="bg-red-500 text-white rounded-md px-4 py-2"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}