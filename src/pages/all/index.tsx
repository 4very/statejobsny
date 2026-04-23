import { render } from 'solid-js/web'

export default () =>
  render(
    () => <></>,
    (() => {
      const div = document.createElement('div')
      document.body.append(div)
      return div
    })(),
  )
