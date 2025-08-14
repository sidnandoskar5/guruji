/**
 * GitHub user data structure
 */
export interface GithubUser {
  /** GitHub username */
  login: string
  /** Avatar image URL */
  avatar_url: string
  /** Full name (optional) */
  name?: string
  /** Bio/description (optional) */
  bio?: string
}

/**
 * Fetches user profile data from GitHub API
 * @param username - GitHub username to fetch
 * @returns Promise resolving to user data or null if not found
 */
export async function fetchGithubUser(username: string): Promise<GithubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`)
    if (!res.ok) return null
    return (await res.json()) as GithubUser
  } catch (_) {
    return null
  }
}


