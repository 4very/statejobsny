import { For, Show, type Component } from 'solid-js'

import { getAndWatchTableData } from '@/parsing/VacancyTable'
import TableRow from './TableRow'

import { useLocalStorage } from '@/util/localStorage'
import SortableColumnHeader from './SortableColumnHeader'
import TableFooter from './TableFooter'
import TableHeader from './TableHeader'

const Table: Component = () => {
  const tableData = getAndWatchTableData()

  const [hiddenRows, setHiddenRows] = useLocalStorage<string[]>(
    'hidden-rows',
    [],
  )

  const hideRow = (id: string) =>
    !hiddenRows().includes(id) && setHiddenRows([...hiddenRows(), id])

  return (
    <div>
      <Show when={tableData()}>
        <TableHeader
          data={tableData()!}
          hiddenRows={hiddenRows()}
          clearHiddenRows={() => setHiddenRows([])}
        ></TableHeader>
      </Show>

      <div class="nys-table">
        <div class="nys-table-wrapper">
          <table>
            <thead>
              <tr>
                <th></th>
                <SortableColumnHeader
                  text="Item #"
                  index={1}
                ></SortableColumnHeader>
                <SortableColumnHeader
                  text="Title"
                  index={2}
                ></SortableColumnHeader>
                {/* <th>Keywords</th> */}
                <SortableColumnHeader
                  text="Grade"
                  index={3}
                ></SortableColumnHeader>
                <SortableColumnHeader
                  text="Posted"
                  index={4}
                ></SortableColumnHeader>
                <SortableColumnHeader
                  text="Deadline"
                  index={5}
                ></SortableColumnHeader>
                <SortableColumnHeader
                  text="Agency"
                  index={6}
                ></SortableColumnHeader>
                <SortableColumnHeader
                  text="County"
                  index={7}
                ></SortableColumnHeader>
              </tr>
            </thead>
            <tbody>
              <For
                each={tableData()?.rows}
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
                {(itemNum) => (
                  <Show when={!hiddenRows().includes(itemNum)}>
                    <TableRow
                      itemNum={itemNum}
                      hide-row={() => hideRow(itemNum)}
                    ></TableRow>
                  </Show>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
      <Show when={tableData()}>
        <TableFooter data={tableData()!}></TableFooter>
      </Show>
    </div>
  )
}

export default Table
