import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

export default function AppRoot() {
    useEffect(() => {
        // Safety net: gỡ pointer-events:none còn sót lại trên body
        // (xảy ra khi dropdown mở dialog/alert-dialog khiến Radix không kịp dọn dẹp overlay)
        const interval = setInterval(() => {
            const hasOpenOverlay = document.querySelector(
                '[data-state="open"][role="dialog"], [data-state="open"][role="menu"]'
            )
            if (!hasOpenOverlay && document.body.style.pointerEvents === 'none') {
                document.body.style.pointerEvents = ''
            }
        }, 300)
        return () => clearInterval(interval)
    }, [])

    return <RouterProvider router={router} />
}