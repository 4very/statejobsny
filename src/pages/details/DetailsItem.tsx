import { Component, Show } from 'solid-js'
import type { DetailsItem } from '../../parsing/VacancyDetails'
import { boldKeywords } from '../../util/keywords'

const DetailsItem: Component<
  { item: DetailsItem } & (
    | { highlight?: false }
    | {
        highlight: true
        itemNum: string
      }
  )
> = (props) => {
  return (
    <div class="nys-display-flex nys-flex-column nys-flex-gap-50">
      <div style={{ 'margin-bottom': 'var(--nys-space-50)' }}>
        <h3>{props.item.title}</h3>
        <Show when={props.item.helpText}>
          <div class="nys-display-flex nys-flex-gap-50">
            <div
              style={{
                width: '5px',
                'background-color': 'var(--nys-color-theme-mid)',
                'min-height': '100%',
              }}
            ></div>
            <span>{props.item.helpText}</span>
          </div>
        </Show>
      </div>

      <span
        innerHTML={
          props.highlight ? boldKeywords(props.item.raw ?? '') : props.item.raw
        }
      ></span>
    </div>
  )
}

export default DetailsItem
