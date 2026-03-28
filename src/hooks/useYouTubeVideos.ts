'use client'

import { useState, useEffect } from 'react'
import { YouTubeVideo, YouTubeChannel, youtubeService } from '@/services/youtube.service'

interface UseYouTubeVideosResult {
  videos: YouTubeVideo[]
  channel: YouTubeChannel | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useYouTubeVideos(maxResults: number = 6): UseYouTubeVideosResult {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [channel, setChannel] = useState<YouTubeChannel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [channelData, videosData] = await Promise.all([
        youtubeService.getChannelInfo(),
        youtubeService.getLatestVideos(maxResults),
      ])
      
      setChannel(channelData)
      setVideos(videosData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar videos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [maxResults])

  return {
    videos,
    channel,
    loading,
    error,
    refetch: fetchData,
  }
}
