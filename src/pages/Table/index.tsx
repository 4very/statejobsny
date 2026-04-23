import { render } from 'solid-js/web'
import { getRowsFromPage } from '../../parsing/VacancyTable'
import App from './App'

function hide(d: Document) {
  const table = d.querySelector<HTMLDivElement>('div#vacancyTable_wrapper')
  table!.style.display = 'none'
}

export default () => {
  // hide(document)
  render(
    () => <App />,
    (() => {
      const tableWrapper = document.querySelector('div#content')
      const app = document.createElement('div')
      tableWrapper?.append(app)
      return app
    })(),
  )
}
