import { createEffect, createSignal, Signal } from 'solid-js'

export function useLocalStorage<T>(key: string, defaultValue: T): Signal<T> {
  const item = localStorage.getItem(key)
  const signal = createSignal(item != null ? JSON.parse(item) : defaultValue)

  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(signal[0]()))
  })

  return signal
}
