import { render } from 'solid-js/web'
import Details from './Details'
import { getDataFromPage } from '../../parsing/VacancyDetails'
import { getSearchParams, getUrlParams } from '../../util/searchParams'
import { refreshDetails, refreshDetailsFromPage } from '../../store'
import Sidebar from './Sidebar'

function hide() {
  document
    .querySelectorAll<HTMLElement>('div#content > :not(.note, #app)')
    .forEach((e) => (e.style.display = 'none'))
}

export default () => {
  const id = getUrlParams(document.location.search).get('id')
  if (id) refreshDetailsFromPage(id)

  render(
    () => (
      <div
        class="nys-grid-row"
        id="app"
      >
        <Details
          class="nys-grid-col-10"
          style={{ 'padding-right': 'var(--nys-space-200)' }}
        />
        <Sidebar />
      </div>
    ),
    (() => {
      const content = document.querySelector('#content')
      if (!content) return document.createElement('div')
      return content
    })(),
  )
  hide()
}
