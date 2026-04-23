import { render } from 'solid-js/web'
import Details from './Details'
import { getDataFromPage } from '../../parsing/VacancyDetails'

export default () => {
  render(
    () => <Details />,
    (() => {
      const content = document.querySelector('#content')
      const app = document.createElement('div')
      content?.appendChild(app)
      return app
    })(),
  )
}
