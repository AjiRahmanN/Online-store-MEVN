import { axiosInstace, axiosPrivateInstace } from '@/utils/axios'
import { useAuthStore } from '@/stores/auth'

let isInterceptorSet = false

export function useApiPrivate() {
  const authStore = useAuthStore()

  if (!isInterceptorSet) {
    // REQUEST INTERCEPTOR
    axiosPrivateInstace.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization && authStore.accessToken) {
          config.headers.Authorization = `Bearer ${authStore.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // RESPONSE INTERCEPTOR
    axiosPrivateInstace.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config

        if (
          (error?.response?.status === 401 || error?.response?.status === 403) &&
          !prevRequest?._retry
        ) {
          prevRequest._retry = true

          try {
            await authStore.refreshToken()
            prevRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
            return axiosPrivateInstace(prevRequest)
          } catch (err) {
            authStore.logout()
            return Promise.reject(err)
          }
        }

        return Promise.reject(error)
      },
    )

    isInterceptorSet = true
  }

  return axiosPrivateInstace
}

export function useApi() {
  return axiosInstace
}
