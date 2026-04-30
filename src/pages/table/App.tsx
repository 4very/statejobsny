import { type Component } from 'solid-js'

import SearchParams from './SearchParams'
import Table from './Table'

const App: Component = () => {
  return (
    <div id="app">
      <SearchParams></SearchParams>
      <Table></Table>
    </div>
  )
}

export default App
