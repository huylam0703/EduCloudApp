import apiClient from '@/lib/apiClient'

export const subjectService = {
    getSubjectsByMajor: async (majorId) => {
        if (!majorId) return []
        const { data } = await apiClient.get(`/subject/getAll/${majorId}`)
        return data.result ?? []
    },

    addSubject: async (majorId, { subjectName, description }) => {
        const { data } = await apiClient.post(`/subject/add/${majorId}`, {
            subjectName,
            description,
        })
        return data.result
    },

    // PUT /subject/update/{subjectId}
    updateSubject: async (subjectId, { subjectName, description }) => {
        const { data } = await apiClient.put(`/subject/update/${subjectId}`, {
            subjectName,
            description,
        })
        return data.result
    },

    // DELETE /subject/delete/{subjectId}
    deleteSubject: async (subjectId) => {
        const { data } = await apiClient.delete(`/subject/delete/${subjectId}`)
        return data
    },
}