import { Component, createSignal } from 'solid-js'
import { linkedButton } from '../../directive/linked'
import type { NysButton } from '@nysds/components'

const Header: Component<{ text?: string; index: number }> = (props) => {
  const getSort = (el: HTMLElement) => {
    switch (el.ariaSort) {
      case 'descending':
        return 'dsc'
      case 'ascending':
        return 'asc'
      default:
        return null
    }
  }

  function changeSort(nysEl: NysButton, srcEl: HTMLTableCellElement) {
    setSort(getSort(srcEl))
  }

  const [sort, setSort] = createSignal<'asc' | 'dsc' | null>(null)

  const observerOptions = {
    attributes: true,
    attributeFilter: ['aria-sort'],
  }

  return (
    <th>
      <nys-button
        variant="ghost"
        label={props.text}
        use:linkedButton={[
          `table#vacancyTable thead th:nth-of-type(${props.index})`,
          changeSort,
          observerOptions,
        ]}
        prop:suffixIcon={
          (sort() == 'asc' && 'arrow_upward') ||
          (sort() == 'dsc' && 'arrow_downward') ||
          'height'
        }
      ></nys-button>
    </th>
  )
}

export default Header
