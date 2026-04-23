import { render } from 'solid-js/web'
import Details from './Details'
import { getDataFromPage } from './data'

export default () => {
  const data = getDataFromPage(document)
  render(
    () => <Details data={data} />,
    (() => {
      const content = document.querySelector('#content')
      const app = document.createElement('div')
      content?.appendChild(app)
      return app
    })(),
  )
}
