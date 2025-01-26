import axiosInstance from './axiosInstance'

export const get = async (url, params = {}) => {
  const response = await axiosInstance.get(url, { params })
  return response.data
}

export const post = async (url, data) => {
  const response = await axiosInstance.post(url, data)
  return response.data
}

export const put = async (url, data) => {
  const response = await axiosInstance.put(url, data)
  return response.data
}

export const del = async (url) => {
  const response = await axiosInstance.delete(url)
  return response.data
}
