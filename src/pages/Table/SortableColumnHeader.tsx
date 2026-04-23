import { Component, createSignal } from 'solid-js'
import {
  createEltSignal,
  useNullableMutationObserver,
} from '../../util/useWaitForElt'

const Header: Component<{ text?: string; index: number }> = (props) => {
  const dtHeader = createEltSignal<HTMLTableCellElement>(
    `table#vacancyTable thead th:nth-of-type(${props.index})`,
  )

  const getSort = () => {
    switch (dtHeader()?.ariaSort) {
      case 'descending':
        return 'dsc'
      case 'ascending':
        return 'asc'
      default:
        return null
    }
  }

  const [sort, setSort] = createSignal<'asc' | 'dsc' | null>(getSort())

  const clickSort = () => dtHeader()?.click()

  useNullableMutationObserver(
    `table#vacancyTable thead th:nth-of-type(${props.index})`,
    () => setSort(getSort()),
    {
      attributes: true,
      attributeFilter: ['aria-sort'],
    },
  )

  return (
    <th>
      <nys-button
        variant="ghost"
        label={props.text}
        on:nys-click={clickSort}
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
