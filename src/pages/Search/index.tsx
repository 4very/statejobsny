import { render } from 'solid-js/web'
import Search from './Search'
import { useWaitForElt } from '../../util/useWaitForElt'

function hide() {
  useWaitForElt<HTMLFormElement>('form#advancedSearchForm').then(
    (elt) => (elt.style.display = 'none'),
  )
}

export default () => {
  render(
    () => <Search />,
    (() => {
      return document.querySelector('div#content')!
    })(),
  )

  hide()
}
