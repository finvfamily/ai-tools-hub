'use client'

import { useState } from 'react'
import { Calendar, MessageSquare, Pencil, Check, X, Loader2, Github } from 'lucide-react'

interface ProfileCardProps {
  profile: {
    username: string
    avatar_url: string | null
    bio: string | null
    github_url: string | null
    post_count: number
    created_at: string
  }
  isOwner: boolean
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function ProfileCard({ profile, isOwner }: ProfileCardProps) {
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(profile.bio ?? '')
  const [savedBio, setSavedBio] = useState(profile.bio ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/community/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio }),
      })
      const data = await res.json()
      if (data.user) {
        setSavedBio(data.user.bio ?? '')
        setBio(data.user.bio ?? '')
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setBio(savedBio)
    setEditing(false)
  }

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <div className="flex items-start gap-5">
        {/* Avatar */}
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.username}
            className="w-16 h-16 rounded-full ring-2 ring-white/10 shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-violet-600/30 flex items-center
            justify-center text-2xl text-violet-400 font-bold ring-2 ring-white/10 shrink-0">
            {profile.username[0].toUpperCase()}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-white truncate">{profile.username}</h1>

            {isOwner && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="shrink-0 flex items-center gap-1.5 text-xs text-white/30
                  hover:text-white/70 transition-colors px-2.5 py-1.5 rounded-lg
                  border border-white/10 hover:border-white/20"
              >
                <Pencil className="w-3 h-3" />
                Edit profile
              </button>
            )}

            {isOwner && editing && (
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs text-violet-400
                    hover:text-violet-300 transition-colors px-2.5 py-1.5 rounded-lg
                    border border-violet-500/30 hover:border-violet-500/60 disabled:opacity-50"
                >
                  {saving
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Check className="w-3 h-3" />}
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 text-xs text-white/30
                    hover:text-white/60 transition-colors px-2.5 py-1.5 rounded-lg
                    border border-white/10 hover:border-white/20"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Bio */}
          {editing ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Write a short bio..."
              maxLength={160}
              rows={2}
              autoFocus
              className="mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10
                text-sm text-white placeholder:text-white/20 outline-none resize-none
                focus:border-violet-500/50 transition-colors"
            />
          ) : (
            savedBio
              ? <p className="text-sm text-white/50 mt-1.5">{savedBio}</p>
              : isOwner
                ? <p className="text-sm text-white/20 mt-1.5 italic">
                    No bio yet — click Edit profile to add one
                  </p>
                : null
          )}

          {/* Stats */}
          <div className="flex items-center gap-5 mt-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              <Calendar className="w-3.5 h-3.5" />
              Joined {formatDate(profile.created_at)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              <MessageSquare className="w-3.5 h-3.5" />
              {profile.post_count ?? 0} topics
            </span>
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
