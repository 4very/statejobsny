import { Component, Show } from 'solid-js'
import { TableData } from '../../parsing/VacancyTable'
// @ts-ignore
import { linkedInput, linkedSelect } from '../../directive/linked'

const TableHeader: Component<{
  data: TableData
  hiddenRows: string[]
  clearHiddenRows: () => void
}> = (props) => {
  return (
    <div class="nys-display-flex nys-flex-gap-50 nys-margin-100 nys-flex-align-end">
      <nys-select
        label="Entries per page"
        use:linkedSelect={'select#dt-length-0'}
      ></nys-select>

      <nys-textinput
        prop:label="Search"
        use:linkedInput={'input#dt-search-0'}
      ></nys-textinput>

      <Show when={props.hiddenRows.length}>
        <nys-button
          id="clear-hidden-rows"
          prop:label="Clear Hidden Rows"
          on:nys-click={() => props.clearHiddenRows}
        ></nys-button>
        <nys-tooltip
          for="clear-hidden-rows"
          text="I am a tooltip."
        ></nys-tooltip>
      </Show>
    </div>
  )
}

export default TableHeader
