import axios from 'axios'

export const authClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default {
  async login(payload) {
    await authClient.get('/sanctum/csrf-cookie')
    return authClient.post('/login', payload)
  },
  logout() {
    return authClient.post('/logout')
  },
  getAuthUser() {
    return authClient.get('/api/users/auth')
  },
}
