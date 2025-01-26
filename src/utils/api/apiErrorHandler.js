export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response
    return {
      status,
      message: data.message || 'An error occurred',
    }
  }

  return {
    status: 500,
    message: 'Network error',
  }
}
