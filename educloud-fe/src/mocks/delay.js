export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
