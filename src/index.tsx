/* @refresh reload */
import './index.css'
import '../node_modules/@nysds/components/dist/nysds.js'
import './assets/nysds-full.min.css'
import './assets/nysds-typography.min.css'
import './assets/theme-admin.css'

import pages from './pages'

const srcPage = document.location.pathname.match('public/(.+)\.cfm')

const pageMapping: Record<string, { render: () => void }> = {
  vacancyDetailsView: {
    render: pages.details,
  },
  vacancyTable: {
    render: pages.list,
  },
}

pages.all()

if (srcPage != null) {
  const page = pageMapping[srcPage[1]]
  if (!page) console.log(`Mapping not found for "${srcPage[1]}"`)
  else {
    page.render()
  }
}
