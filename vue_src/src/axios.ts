import axios from 'axios'
import { ElNotification } from 'element-plus'
import { getUserInfo } from '@/composables/auth'
const service = axios.create({
  baseURL: '/api',
})
// Add a request interceptor
service.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const { token, userId } = getUserInfo()
    if (token) {
      config.headers['token'] = token
      config.headers['userId'] = userId
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
service.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    ElNotification({
      message: error.response.data.message || '请求失败',
      type: 'error',
      duration: 3000,
    })

    return Promise.reject(error)
  },
)
export default service
