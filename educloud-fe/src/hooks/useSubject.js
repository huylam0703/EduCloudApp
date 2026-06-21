import { useEffect, useState } from 'react'
import { subjectService } from '@/services/subjectService'

export function useSubjects(majorId) {
    const [subjects, setSubjects] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!majorId) {
            setSubjects([])
            return
        }

        const controller = new AbortController()
        setLoading(true)
        setError(null)

        subjectService
            .getSubjectsByMajor(majorId)
            .then((data) => setSubjects(data))
            .catch((err) => {
                if (err.name !== 'AbortError') setError(err)
            })
            .finally(() => setLoading(false))

        return () => controller.abort()
    }, [majorId])

    return { subjects, isLoading, error }
}