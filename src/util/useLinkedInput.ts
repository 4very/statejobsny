import { NysSelectProps } from '@nysds/components/react'
import { createMemo, createSignal } from 'solid-js'

function useLinkedInput(
  query: string,
  event: 'change' | 'input',
): [() => string | undefined, NysSelectProps['onNysChange']] {
  const input = document.querySelector<HTMLInputElement>(query)
  const update: NysSelectProps['onNysChange'] = (e) => {
    if (!input) return
    input.value = e.detail.value
    input?.dispatchEvent(new Event(event))
  }

  const [value, setValue] = createSignal(input?.value)

  return [value, update]
}

export default useLinkedInput
