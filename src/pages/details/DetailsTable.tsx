import { Component, Index, Show } from 'solid-js'
import type { DetailsItem } from '@/parsing/VacancyDetails'

const DetailsTable: Component<{ data: DetailsItem[] }> = (props) => {
  return (
    <div class="nys-table">
      <div class="nys-table-wrapper">
        <table>
          <tbody>
            <Index each={Object.values(props.data)}>
              {(item) => (
                <tr>
                  <td
                    style={{
                      padding: 'var(--nys-space-100)',
                      'padding-left': 'var(--nys-space-200)',
                    }}
                  >
                    <b>{item().title}</b>
                    <Show when={item().helpText}>
                      <nys-icon
                        size="xl"
                        name="help"
                        style={{ 'padding-left': '5px' }}
                        id={`${item().title}-help`}
                      ></nys-icon>
                      <nys-tooltip
                        prop:for={`${item().title}-help`}
                        prop:text={item().helpText}
                      ></nys-tooltip>
                    </Show>
                  </td>
                  <td
                    style={{
                      padding: 'var(--nys-space-100)',
                    }}
                    innerHTML={item().raw}
                  />
                </tr>
              )}
            </Index>
          </tbody>
        </table>
        {/* </nys-table> */}
      </div>
    </div>
  )
}

export default DetailsTable
