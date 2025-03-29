'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/clients'

export default function CreatePostForm({ user }) {
  const supabase = createClient()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Vous devez être connecté pour envoyer un message.')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.from('posts').insert([
        {
          content,
          id_user: user.id,
        },
      ])
      if (error) throw error

      alert('Message ajouté avec succès!')
      setContent('')
    } catch (error) {
      console.error('Erreur lors de l’ajout du message:', error)
      alert('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écrivez votre message..."
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows="4"
        required
      ></textarea>
      <button
        type="submit"
        className={`bg-blue-500 text-white rounded-md px-4 py-2 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Envoi en cours...' : 'Envoyer'}
      </button>
    </form>
  )
}
