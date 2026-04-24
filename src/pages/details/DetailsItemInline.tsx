import { Component, Show } from 'solid-js'
import type { DetailsItem } from '../../parsing/VacancyDetails'

const DetailsItemInline: Component<{ item: DetailsItem }> = (props) => {
  return (
    <div style={{ 'margin-bottom': 'var(--nys-space-50)' }}>
      <span class="nys-font-h6">{props.item.title}: </span>
      <span innerHTML={props.item.raw?.trim()}></span>
    </div>
  )
}

export default DetailsItemInline
