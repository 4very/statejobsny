import { Accessor } from 'solid-js'
import { useWaitForElt } from '../util/useWaitForElt'
import type {
  NysButton,
  NysCheckbox,
  NysSelect,
  NysTextinput,
} from '@nysds/components'

export async function linkedInput<T extends NysTextinput | NysCheckbox>(
  nysElt: T,
  accessor: Accessor<string>,
) {
  const selector = accessor()

  const srcElt = await useWaitForElt<HTMLInputElement>(selector)

  const syncInputs = (value: any, fromElt: any, toElt: any) => {
    if (typeof value == 'string') toElt.value = value
    else if (typeof value.getMonth == 'function') toElt.valueAsDate = value

    if (toElt.type == 'checkbox' || fromElt.type == 'checkbox')
      toElt.checked = fromElt.checked
  }

  syncInputs(srcElt.value, srcElt, nysElt)

  const updateSrcElt = (e: any) => {
    syncInputs(e.detail.value, nysElt, srcElt)
    srcElt?.dispatchEvent(new Event('input'))
  }

  nysElt.addEventListener('nys-input', updateSrcElt)
  nysElt.addEventListener('nys-change', updateSrcElt)
}

export async function linkedSelect<T extends NysSelect>(
  nysElt: T,
  accessor: Accessor<string>,
) {
  const selector = accessor()

  const srcElt = await useWaitForElt<HTMLSelectElement>(selector)

  if (srcElt.tagName == 'SELECT') {
    const options = [...srcElt.children] as HTMLOptionElement[]
    const newOptions = options.map((option) => {
      const newOption = document.createElement('option')
      newOption.value = option.value == '' ? 'empty' : option.value
      newOption.text = option.text
      if (option.value == srcElt.value) newOption.selected = true
      return newOption
    })
    nysElt.replaceChildren(...newOptions)
  }

  nysElt.value = srcElt.value
  nysElt.addEventListener('nys-change', (e: any) => {
    if (!srcElt) return
    srcElt.value = e.detail.value === 'empty' ? '' : e.detail.value
    srcElt?.dispatchEvent(new Event('change'))
  })
}

type UpdateFunction = (nysEl: NysButton, srcEl: HTMLElement) => void

export async function linkedButton(
  nysEl: NysButton,
  accessor: Accessor<[string, UpdateFunction?, MutationObserverInit?]>,
) {
  const [selector, updateFunction, observeOptions] = accessor()

  const srcEl = await useWaitForElt<HTMLElement>(selector)

  nysEl.addEventListener('nys-click', () => srcEl.click())

  if (updateFunction) {
    updateFunction(nysEl, srcEl)
    const observer = new MutationObserver(() => updateFunction(nysEl, srcEl))
    observer.observe(srcEl, observeOptions)
  }
}
