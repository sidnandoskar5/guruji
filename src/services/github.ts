export interface GithubUser {
  login: string
  avatar_url: string
  name?: string
  bio?: string
}

export async function fetchGithubUser(username: string): Promise<GithubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`)
    if (!res.ok) return null
    return (await res.json()) as GithubUser
  } catch (_) {
    return null
  }
}


