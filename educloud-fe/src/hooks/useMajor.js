import { useEffect, useState } from 'react'
import { majorService } from '@/services/majorService'

export function useMajors(searchString = '') {
  const [majors, setMajors]     = useState([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await majorService.getMajors(searchString)
        setMajors(data)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err)
      } finally {
        setLoading(false)
      }
    }, 300) // debounce 300ms

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [searchString])

  return { majors, isLoading, error }
}