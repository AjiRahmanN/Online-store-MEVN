import { axiosInstace, axiosPrivateInstace } from '@/utils/axios'
import { useAuthStore } from '@/stores/auth'

export function useApiPrivate() {
  const authStore = useAuthStore()

  axiosPrivateInstace.interceptors.request.use(
    (config) => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${authStore.accessToken}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )
  axiosPrivateInstace.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config
      if (
        error?.response?.status === 401 ||
        (error?.response?.status === 403 && !prevRequest?.sent)
      ) {
        prevRequest.sent = true
        await authStore.refreshToken()
        prevRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`
        return axiosInstace(prevRequest)
      }
      Promise.reject(error)
    },
  )
  return axiosPrivateInstace
}

export function useApi(): typeof axiosInstace {
  return axiosInstace
}
// module.exports = { useApi }
