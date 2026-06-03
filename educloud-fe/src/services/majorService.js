const BASE_URL = 'http://localhost:8080/api/v1/eduCloud'

export const majorService = {
  getMajors: async (searchString = '') => {
    const params = new URLSearchParams()
    if (searchString.trim()) {
      params.append('searchString', searchString.trim())
    }

    const res = await fetch(`${BASE_URL}/base/majors?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch majors')

    const json = await res.json()
    // ApiResponse wrapper: { code, message, result: MajorResponse[] }
    return json.result ?? []
  },
}