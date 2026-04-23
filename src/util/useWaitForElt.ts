import { onCleanup } from 'solid-js'

export function useWaitForElt<T extends Element>(selector: string): Promise<T> {
  return new Promise((resolve) => {
    const elt = document.querySelector<T>(selector)
    if (elt) return resolve(elt)

    const observer = new MutationObserver((mutations) => {
      const elt = document.querySelector<T>(selector)
      if (elt) {
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
