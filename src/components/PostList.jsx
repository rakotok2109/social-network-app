'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/clients'

export default function PostList() {
  const supabase = createClient()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('posts').select(`
        id,
        content,
        created_at,
        profiles (
          avatar_url,
          username
        )
      `)

      if (error) throw error
      setPosts(data)
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel('realtime:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          console.log('Nouveau message reçu:', payload.new)
          setPosts((prevPosts) => [payload.new, ...prevPosts])
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])


  if (loading) {
    return <p>Chargement des messages...</p>
  }

  if (posts.length === 0) {
    return <p>Aucun message n'a encore été rédigé.</p>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border border-gray-300 rounded-md p-4 shadow-sm"
        >
          <div>
            <img
                src={post.profiles?.avatar_url || '/default-avatar.png'}
                alt="Photo de profil"
                className="w-12 h-12 rounded-full"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Rédigé par : {post.profiles?.username || 'Anonyme'}
            </p>
            <p className="text-gray-800">{post.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
