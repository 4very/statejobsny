import { createSignal, onCleanup } from 'solid-js'

const TIMEOUT_MS = 60 * 1000

export function useWaitForElts<T extends Element>(
  selector: string,
  root?: Document | Element,
): Promise<NodeListOf<T>> {
  return new Promise((resolve, reject) => {
    const elt = (root || document).querySelectorAll<T>(selector)
    if (elt) return resolve(elt)

    const timeout_id = setTimeout(
      () => reject('Could not resolve element in reasonable time.'),
      TIMEOUT_MS,
    )

    const observer = new MutationObserver((_) => {
      const elt = (root || document).querySelectorAll<T>(selector)
      if (elt) {
        clearTimeout(timeout_id)
        observer.disconnect()
        return resolve(elt)
      }
    })

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export function useWaitForElt<T extends Element>(
  selector: string,
  root?: Document | Element,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const elt = (root || document).querySelector<T>(selector)
    if (elt) return resolve(elt)

    const timeout_id = setTimeout(
      () => reject('Could not resolve element in reasonable time.'),
      TIMEOUT_MS,
    )

    const observer = new MutationObserver((_) => {
      const elt = (root || document).querySelector<T>(selector)
      if (elt) {
        clearTimeout(timeout_id)
        observer.disconnect()
        return resolve(elt)
      }
    })

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export function createEltSignal<T extends Element>(selector: string) {
  const [signal, setSignal] = createSignal<T | null>()
  useWaitForElt<T>(selector).then(setSignal)
  return signal
}

export function useNullableMutationObserver(
  selectors: string | string[],
  callback: MutationCallback,
  options: MutationObserverInit,
): [MutationObserver, Promise<void[]>] {
  const observer = new MutationObserver(callback)

  const elts = (Array.isArray(selectors) ? selectors : [selectors]).map(
    (selector) =>
      useWaitForElt(selector).then((elt) => {
        observer.observe(elt, options)
        onCleanup(() => observer.disconnect())
      }),
  )
  return [observer, Promise.all(elts)]
}
