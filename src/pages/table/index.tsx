import { render } from 'solid-js/web'
import Table from './Table'
import { useWaitForElt } from '@/util/useWaitForElt'

function hide() {
  useWaitForElt<HTMLDivElement>('div#vacancyTable_wrapper').then(
    (table) => (table.style.display = 'none'),
  )
}

export default () => {
  render(
    () => <Table />,
    (() => {
      const tableWrapper = document.querySelector('div#content')
      const app = document.createElement('div')
      tableWrapper?.append(app)
      return app
    })(),
  )
  hide()
}
