import axios from 'axios'

export const axiosInstace = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your API base URL
  withCredentials: true,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosPrivateInstace = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your API base URL
  withCredentials: true,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
})
