import * as API from '@/services/API'

export default {
  getCategory() {
    return API.apiClient.get('/category')
  },
  getOneCategory(id) {
    return API.apiClient.get('/category/' + id)
  },
  getStatus() {
    return API.apiClient.get('/status')
  },
  getMaterial(categoryId) {
    return API.apiClient.get('/material/' + categoryId)
  },
  getQuiz(materialId) {
    return API.apiClient.get('/quiz/' + materialId)
  },
  updateStatus(materialId, payload) {
    return API.apiClient.post('/status/' + materialId, payload)
  },
  createStatus(payload) {
    return API.apiClient.post('/status/', payload)
  },
}
