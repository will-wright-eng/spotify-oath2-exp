import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  return config
})

export const spotifyApi = {
  login: async () => {
    const { data } = await api.get('/auth/login')
    window.location.href = data.auth_url
    return data
  },
  getCurrentUser: async () => {
    const { data } = await api.get('/spotify/me')
    console.log(data)
    return data
  },
  getCurrentTrack: async () => {
    const { data } = await api.get('/spotify/now-playing')
    return data
  },
  getRecentTracks: async () => {
    const { data } = await api.get('/spotify/recently-played')
    console.log(data)
    return data
  },
  getPlaylists: async () => {
    const { data } = await api.get('/spotify/playlists')
    console.log(data)
    return data
  }
}
