import { useState, useEffect, useRef, useMemo } from 'react'

export function useInfiniteScroll(data = [], pageSize = 20) {
    const [visibleCount, setVisibleCount] = useState(pageSize)
    const sentinelRef = useRef(null)
    const containerRef = useRef(null) // gắn vào div có overflow-y-auto

    // reset khi data đổi (vd: đổi từ khoá tìm kiếm, đổi major...)
    useEffect(() => {
        setVisibleCount(pageSize)
    }, [data, pageSize])

    useEffect(() => {
        const node = sentinelRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + pageSize, data.length))
                }
            },
            { root: containerRef.current, threshold: 0.1 }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [data.length, pageSize])

    const visibleData = useMemo(() => data.slice(0, visibleCount), [data, visibleCount])
    const hasMore = visibleCount < data.length

    return { visibleData, sentinelRef, containerRef, hasMore }
}