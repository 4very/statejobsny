import { children, Component, JSX } from 'solid-js'

const LinkedInput: Component<{
  children: any
  querySelector: string
}> = (props) => {
  const otherInput = document.querySelector<HTMLInputElement>(
    props.querySelector,
  )

  props.children!.value = otherInput!.value
  props.children!.dispatchEvent(new Event('input'))
  console.log(otherInput?.value)
  return props.children
}

export default LinkedInput
