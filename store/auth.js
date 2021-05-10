import { getError } from '@/utils/helpers'
import AuthService from '@/services/AuthService'

export const state = () => ({
  user: null,
  loading: false,
  error: null,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  },
}

export const actions = {
  logout({ commit }) {
    return AuthService.logout()
      .then(() => {
        commit('setUser', null)
        if (this.$router.currentRoute.name !== 'login')
          this.$router.push({ path: '/login' })
      })
      .catch((error) => {
        commit('setError', getError(error))
      })
  },
  async getAuthUser({ commit }) {
    commit('setLoading', true)
    try {
      const response = await AuthService.getAuthUser()
      commit('setUser', response.data.data)
      commit('setLoading', false)
      return response.data.data
    } catch (error) {
      commit('setLoading', false)
      commit('setUser', null)
      commit('setError', getError(error))
    }
  },
}

export const getters = {
  authUser: (state) => {
    return state.user
  },
  isAdmin: (state) => {
    return state.user.is_admin
  },
  error: (state) => {
    return state.error
  },
  loading: (state) => {
    return state.loading
  },
  loggedIn: (state) => {
    return !!state.user
  },
}
