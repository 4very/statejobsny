import { render } from 'solid-js/web'
import List from './List'
import { getRowsFromPage } from './data'

function hide(d: Document) {
  const table = d.querySelector<HTMLDivElement>('div#vacancyTable_wrapper')
  table!.style.display = 'none'
}

export default () => {
  // hide(document)
  render(
    () => <List />,
    (() => {
      const tableWrapper = document.querySelector('div#content')
      const app = document.createElement('div')
      tableWrapper?.append(app)
      return app
    })(),
  )
}
