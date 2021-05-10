import * as API from '@/services/API'

export default {
  getCategory() {
    return API.apiClient.get('/category')
  },
  getStatus() {
    return API.apiClient.get('/status')
  },
}
