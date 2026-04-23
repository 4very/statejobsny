import { GM_getValue, GM_setValue } from '$'
import { createEffect, createSignal, Signal } from 'solid-js'
import { unwrap } from 'solid-js/store'

export function useLocalStorage<T>(key: string, defaultValue: T): Signal<T> {
  const signal = createSignal(getLocalStorageItem(key, defaultValue))

  createEffect(() => setLocalStorageItem(key, signal[0]()))
  return signal
}

export function setLocalStorageItem(key: string, value: unknown) {
  // localStorage.setItem(key, JSON.stringify(unwrap(value)))
  GM_setValue(key, unwrap(value))
}

export function getLocalStorageItem<T>(key: string, defaultValue: T) {
  // const value = localStorage.getItem(key)
  // return value ? (JSON.parse(value) as T) : defaultValue

  return GM_getValue(key, defaultValue)
}
