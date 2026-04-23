import { Component, For, JSX } from 'solid-js'

const style: JSX.CSSProperties = {
  'font-weight': 'var(--nys-font-weight-semibold, 600)',
}

const KeyValue: Component<{
  label: string
  value: string | string[] | number | number[] | undefined
}> = (props) => {
  return (
    <div class="nys-display-flex nys-flex-gap-50">
      <div
        class="nys-label"
        style={style}
      >
        {props.label}
      </div>
      <div>
        <For each={Array.isArray(props.value) ? props.value : [props.value]}>
          {(value) => <div>{value}</div>}
        </For>
      </div>
    </div>
  )
}

export default KeyValue
