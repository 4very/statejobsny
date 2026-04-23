import { Component } from 'solid-js'
import type { JSX } from 'solid-js'

const style: JSX.CSSProperties = {
  'background-color': 'var(--nys-color-theme-mid)',
  color: 'var(--nys-color-text-reverse)',
  'border-radius': 'var(--nys-radius-sm)',
  'padding-left': 'var(--nys-space-50)',
  'padding-right': 'var(--nys-space-50)',
  'padding-top': 'var(--nys-space-2px)',
  'padding-bottom': 'var(--nys-space-2px)',
  width: 'max-content',
}

const Tag: Component<{
  label: string
  itemNum: string
  index: number
  skill: string
}> = (props) => {
  return (
    <>
      <div
        id={`${props.itemNum}-${props.index}`}
        style={style}
      >
        {props.label}
      </div>
    </>
  )
}

export default Tag
