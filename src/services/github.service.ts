/**
 * GitHub Service - Repository Pattern
 * Handles all GitHub API interactions with caching
 */

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  homepage: string | null
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache: Map<string, CacheEntry<unknown>> = new Map()

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key)
    return null
  }
  
  return entry.data as T
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export class GitHubService {
  private static instance: GitHubService
  private baseUrl = 'https://api.github.com'
  private username: string

  private constructor() {
    this.username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'jorge-holguin'
  }

  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService()
    }
    return GitHubService.instance
  }

  async getPublicRepos(): Promise<GitHubRepo[]> {
    const cacheKey = `repos_${this.username}`
    const cached = getFromCache<GitHubRepo[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/users/${this.username}/repos?sort=updated&direction=desc&per_page=30&type=public`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
          next: { revalidate: 300 } // ISR: revalidate every 5 minutes
        }
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const repos: GitHubRepo[] = await response.json()
      
      // Filter out forks and sort by updated_at
      const filteredRepos = repos
        .filter((repo: GitHubRepo & { fork?: boolean }) => !repo.fork)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

      setCache(cacheKey, filteredRepos)
      return filteredRepos
    } catch (error) {
      console.error('Error fetching GitHub repos:', error)
      throw error
    }
  }

  async getRepoLanguages(repoName: string): Promise<Record<string, number>> {
    const cacheKey = `languages_${repoName}`
    const cached = getFromCache<Record<string, number>>(cacheKey)
    
    if (cached) {
      return cached
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${this.username}/${repoName}/languages`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const languages = await response.json()
      setCache(cacheKey, languages)
      return languages
    } catch (error) {
      console.error('Error fetching repo languages:', error)
      throw error
    }
  }
}

// Export singleton instance
export const githubService = GitHubService.getInstance()
