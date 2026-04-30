import { GM } from '$'
import { createEffect, createSignal, Signal } from 'solid-js'
import { unwrap } from 'solid-js/store'

export function useLocalStorage<T>(key: string, defaultValue: T): Signal<T> {
  const signal = createSignal(defaultValue)
  getLocalStorageItem(key, defaultValue).then((v) => signal[1](() => v))

  createEffect(() => setLocalStorageItem(key, signal[0]()))
  return signal
}

export function setLocalStorageItem(key: string, value: unknown) {
  // localStorage.setItem(key, JSON.stringify(unwrap(value)))
  GM.setValue(key, unwrap(value))
}

export function getLocalStorageItem<T>(key: string, defaultValue: T) {
  // const value = localStorage.getItem(key)
  // return value ? (JSON.parse(value) as T) : defaultValue

  return GM.getValue(key, defaultValue)
}

export async function localStoreItemExists(key: string) {
  return GM.listValues().then((values) => values.includes(key))
}
