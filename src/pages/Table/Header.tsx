import { Component, createSignal, onMount } from 'solid-js'

const Header: Component<{ text?: string; index: number }> = (props) => {
  const dtHeader = document.querySelector<HTMLTableCellElement>(
    `table#vacancyTable thead th:nth-of-type(${props.index})`,
  )

  const getSort = () => {
    switch (dtHeader?.ariaSort) {
      case 'descending':
        return 'dsc'
      case 'ascending':
        return 'asc'
      default:
        return null
    }
  }

  const [sort, setSort] = createSignal<'asc' | 'dsc' | null>(getSort())

  const clickSort = () => dtHeader?.click()

  onMount(() => {
    if (!dtHeader) return
    const observer = new MutationObserver(() => setSort(getSort()))
    observer.observe(dtHeader, {
      attributes: true,
      attributeFilter: ['aria-sort'],
    })
  })

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
