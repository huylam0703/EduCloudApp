const BASE_URL = 'http://localhost:8080/api/v1/eduCloud'

export const subjectService = {
    getSubjectsByMajor: async (majorId) => {
        if (!majorId) return []

        const res = await fetch(`${BASE_URL}/subject/getAll/${majorId}`)
        if (!res.ok) throw new Error('Failed to fetch subjects')

        const json = await res.json()
        // ApiResponse wrapper: { code, message, result: SubjectResponse[] }
        return json.result ?? []
    },
}