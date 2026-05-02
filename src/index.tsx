/* @refresh reload */
import './index.css'

import './assets/nysds-full.min.css'
import './assets/nysds-typography.min.css'
import './assets/theme-admin.css'
import { getPathInformation } from './util/pathInformation.js'

const pageMapping: Record<string, { render: () => Promise<void> }> = {
  vacancyDetailsView: {
    render: async () => (await import('@/pages/details')).default(),
  },
  vacancyTable: {
    render: async () => (await import('@/pages/table/index.jsx')).default(),
  },

  search: {
    render: async () => (await import('@/pages/search')).default(),
  },
}

const path = getPathInformation()

if (path != null && path.page != undefined) {
  const page = pageMapping[path.page]
  if (!page) console.log(`Mapping not found for "${path.page}"`)
  else {
    page.render()
  }
}
