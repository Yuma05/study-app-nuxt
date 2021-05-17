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
  getMaterials(categoryId) {
    return API.apiClient.get('/materials/' + categoryId)
  },
  getMaterial(id) {
    return API.apiClient.get('/material/' + id)
  },
}
