import { Accessor } from 'solid-js'
import { useWaitForElt } from '../util/useWaitForElt'
import type { NysButton, NysSelect, NysTextinput } from '@nysds/components'

export async function linkedInput<T extends NysTextinput | NysSelect>(
  el: T,
  accessor: Accessor<[string, string]>,
) {
  const [selector, eventName] = accessor()

  const elt = await useWaitForElt<HTMLSelectElement>(selector)
  el.value = elt.value
  if (elt.tagName == 'SELECT') {
    const option = el.querySelector<HTMLOptionElement>(
      `option[value="${elt.value}"]`,
    )
    if (option) option.selected = true
  }

  el.addEventListener('nys-' + eventName, (e: any) => {
    if (!elt) return
    elt.value = e.detail.value
    elt?.dispatchEvent(new Event(eventName))
  })
}

export async function linkedButton(el: NysButton, accessor: Accessor<string>) {
  const [selector] = accessor()

  const elt = await useWaitForElt<HTMLElement>(selector)

  el.addEventListener('nys-click', () => elt.click())
}
