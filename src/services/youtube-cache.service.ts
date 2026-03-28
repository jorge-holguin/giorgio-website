/**
 * YouTube Cache Service - Supabase Persistence Layer
 * Caches YouTube API responses in Supabase to reduce API quota usage.
 * Falls back gracefully when Supabase is not configured.
 *
 * SQL to create the table in Supabase:
 * -------------------------------------------------
 * CREATE TABLE youtube_cache (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   cache_key TEXT UNIQUE NOT NULL,
 *   data JSONB NOT NULL,
 *   expires_at TIMESTAMPTZ NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 * CREATE INDEX idx_youtube_cache_key ON youtube_cache(cache_key);
 * -------------------------------------------------
 */

import { createClient } from '@supabase/supabase-js'
import type { YouTubeVideo, YouTubeChannel } from './youtube.service'

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour in Supabase (longer than in-memory)

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  return url !== '' && url.startsWith('https://')
}

// Untyped client for the youtube_cache table (avoids strict DB typing issues)
function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
  )
}

export async function getCachedVideos(cacheKey: string): Promise<YouTubeVideo[] | null> {
  if (!isSupabaseConfigured()) return null

  try {
    const client = getClient()
    const { data, error } = await client
      .from('youtube_cache')
      .select('data, expires_at')
      .eq('cache_key', cacheKey)
      .single()

    if (error || !data) return null

    if (new Date(data.expires_at) < new Date()) {
      await client.from('youtube_cache').delete().eq('cache_key', cacheKey)
      return null
    }

    return (data.data as { videos: YouTubeVideo[] }).videos ?? null
  } catch {
    return null
  }
}

export async function setCachedVideos(cacheKey: string, videos: YouTubeVideo[]): Promise<void> {
  if (!isSupabaseConfigured()) return

  const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString()

  try {
    const client = getClient()
    await client
      .from('youtube_cache')
      .upsert(
        {
          cache_key: cacheKey,
          data: { videos },
          expires_at: expiresAt,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'cache_key' }
      )
  } catch {
    // Silently fail — caching is best-effort
  }
}

export async function getCachedChannel(cacheKey: string): Promise<YouTubeChannel | null> {
  if (!isSupabaseConfigured()) return null

  try {
    const client = getClient()
    const { data, error } = await client
      .from('youtube_cache')
      .select('data, expires_at')
      .eq('cache_key', cacheKey)
      .single()

    if (error || !data) return null

    if (new Date(data.expires_at) < new Date()) {
      await client.from('youtube_cache').delete().eq('cache_key', cacheKey)
      return null
    }

    return (data.data as { channel: YouTubeChannel }).channel ?? null
  } catch {
    return null
  }
}

export async function setCachedChannel(cacheKey: string, channel: YouTubeChannel): Promise<void> {
  if (!isSupabaseConfigured()) return

  const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString()

  try {
    const client = getClient()
    await client
      .from('youtube_cache')
      .upsert(
        {
          cache_key: cacheKey,
          data: { channel },
          expires_at: expiresAt,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'cache_key' }
      )
  } catch {
    // Silently fail
  }
}
