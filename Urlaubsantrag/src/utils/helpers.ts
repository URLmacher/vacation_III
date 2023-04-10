export interface IDebouncedFunction {
  (): void
  cancel: () => void
}

export const debounce = (callback: () => void, timeoutMs: number = 500): IDebouncedFunction => {
  let timeout: number | null = null

  const debounced = (): void => {
    if (timeout !== null) {
      window.clearTimeout(timeout)
    }

    timeout = window.setTimeout(() => {
      callback()
      timeout = null
    }, timeoutMs)
  }

  debounced.cancel = (): void => {
    if (timeout) {
      window.clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}
