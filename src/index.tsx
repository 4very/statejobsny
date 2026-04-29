/* @refresh reload */
import './index.css'
import '../node_modules/@nysds/components/dist/nysds.js'
import './assets/nysds-full.min.css'
import './assets/nysds-typography.min.css'
import './assets/theme-admin.css'

import pages from './pages'

const pathRegex = /(?<root>public|employees)\/(?<page>.+)\.cfm/g

const path = pathRegex.exec(document.location.pathname)

const pageMapping: Record<string, { render: () => void }> = {
  vacancyDetailsView: {
    render: pages.details,
  },
  vacancyTable: {
    render: pages.list,
  },

  search: {
    render: pages.search,
  },
}

pages.all()

if (path != null && path.groups != undefined) {
  const page = pageMapping[path.groups.page]
  if (!page) console.log(`Mapping not found for "${path.groups.page}"`)
  else {
    page.render()
  }
}
