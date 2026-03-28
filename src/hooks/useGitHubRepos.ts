'use client'

import { useState, useEffect } from 'react'
import { GitHubRepo, githubService } from '@/services/github.service'

interface UseGitHubReposResult {
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useGitHubRepos(): UseGitHubReposResult {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRepos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await githubService.getPublicRepos()
      setRepos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar repositorios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepos()
  }, [])

  return {
    repos,
    loading,
    error,
    refetch: fetchRepos,
  }
}
