import { render } from 'solid-js/web'
import App from './App'
import { useWaitForElt } from '../../util/useWaitForElt'

function hide() {
  useWaitForElt<HTMLDivElement>('div#vacancyTable_wrapper').then(
    (table) => (table.style.display = 'none'),
  )
}

export default () => {
  render(
    () => <App />,
    (() => {
      const tableWrapper = document.querySelector('div#content')
      const app = document.createElement('div')
      tableWrapper?.append(app)
      return app
    })(),
  )
  hide()
}
