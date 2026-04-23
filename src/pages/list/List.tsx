import { For, Show, type Component } from 'solid-js'

import { NysSelectProps, NysTextinputProps } from '@nysds/components/react'
import { getReactivePageData } from './data'
import Row from './Row'

import { useLocalStorage } from '../../util/localStorage'
import Header from './Header'
import Pagination from './Pagination'
import SearchParams from './SearchParams'
import LinkedInput from '../../components/LinkedInput'
import useLinkedInput from '../../util/useLinkedInput'

const List: Component = () => {
  const data = getReactivePageData(document)

  const [tableLength, updateTableLength] = useLinkedInput(
    'select#dt-length-0',
    'change',
  )

  const [search, updateSearch] = useLinkedInput('input#dt-search-0', 'input')

  const [hiddenRows, setHiddenRows] = useLocalStorage<string[]>(
    'hidden-rows',
    [],
  )

  const hideRow = (id: string) =>
    !hiddenRows().includes(id) && setHiddenRows([...hiddenRows(), id])

  return (
    <div id="app">
      <SearchParams></SearchParams>

      <div class="nys-display-flex nys-flex-gap-50 nys-margin-100 nys-flex-align-end">
        <nys-select
          label="Entries per page"
          value={tableLength()}
          on:nys-change={updateTableLength}
        >
          <option
            value="10"
            selected={tableLength() == '10'}
          >
            10
          </option>
          <option
            value="25"
            selected={tableLength() == '25'}
          >
            25
          </option>
          <option
            value="50"
            selected={tableLength() == '50'}
          >
            50
          </option>
          <option
            value="100"
            selected={tableLength() == '100'}
          >
            100
          </option>
        </nys-select>

        <nys-textinput
          prop:label="Search"
          prop:value={search()}
          on:nys-input={updateSearch}
        ></nys-textinput>

        <Show when={hiddenRows()?.length}>
          <nys-button
            id="clear-hidden-rows"
            prop:label="Clear Hidden Rows"
            on:nys-click={() => setHiddenRows([])}
          ></nys-button>
          <nys-tooltip
            for="clear-hidden-rows"
            text="I am a tooltip."
          ></nys-tooltip>
        </Show>
      </div>

      <div class="nys-table">
        <div class="nys-table-wrapper">
          <table>
            <thead>
              <tr>
                <th></th>
                <Header
                  text="Item #"
                  index={1}
                ></Header>
                <Header
                  text="Title"
                  index={2}
                ></Header>
                {/* <th>Keywords</th> */}
                <Header
                  text="Grade"
                  index={3}
                ></Header>
                <Header
                  text="Posted"
                  index={4}
                ></Header>
                <Header
                  text="Deadline"
                  index={5}
                ></Header>
                <Header
                  text="Agency"
                  index={6}
                ></Header>
                <Header
                  text="County"
                  index={7}
                ></Header>
              </tr>
            </thead>
            <tbody>
              <For
                each={data().rows}
                fallback={
                  <tr>
                    <td
                      class="nys-font-body-md"
                      colSpan={8}
                    >
                      No Data
                    </td>
                  </tr>
                }
              >
                {(item, index) => (
                  <Show when={!hiddenRows().includes(item.itemNum)}>
                    <Row
                      data-index={item.itemNum}
                      data={item}
                      hide-row={() => hideRow(item.itemNum)}
                    ></Row>
                  </Show>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="nys-display-flex nys-flex-align-center nys-flex-gap-50 nys-margin-50"
        style={{ 'justify-content': 'space-between' }}
      >
        <span>
          Showing {data().start} to {data().end} of {data().total} entries
        </span>
        <Pagination data={data()}></Pagination>
      </div>
    </div>
  )
}

export default List
