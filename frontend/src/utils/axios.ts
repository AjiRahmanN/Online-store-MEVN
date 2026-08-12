import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export const axiosInstace = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // ⬅ 10 DETIK (WAJIB)
})

export const axiosPrivateInstace = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})
