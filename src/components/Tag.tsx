import { Component } from 'solid-js'
import TagCss from './Tag.module.css'

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
        class={TagCss.Tag}
      >
        {props.label}
      </div>
    </>
  )
}

export default Tag
