import { render } from 'solid-js/web'
import Table from './Table'
import { getRowsFromPage } from '../../parsing/VacancyTable'

function hide(d: Document) {
  const table = d.querySelector<HTMLDivElement>('div#vacancyTable_wrapper')
  table!.style.display = 'none'
}

export default () => {
  // hide(document)
  render(
    () => <Table />,
    (() => {
      const tableWrapper = document.querySelector('div#content')
      const app = document.createElement('div')
      tableWrapper?.append(app)
      return app
    })(),
  )
}
