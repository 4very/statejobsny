import { createStore } from 'solid-js/store'
import { RowData } from './parsing/VacancyTable'
import {
  getDataFromLink,
  getDataFromPage,
  VacancyDetails,
} from './parsing/VacancyDetails'
import { getKeywordsFromDetails, Keyword } from './util/keywords'
import { getLocalStorageItem, setLocalStorageItem } from './util/localStorage'
import { getPathInformation } from './util/pathInformation'

function getDetailsLink(itemNum: string) {
  const pageContext = getPathInformation()
  return `${document.location.origin}/${pageContext.root}/vacancyDetailsView.cfm?id=${itemNum}`
}

type Vacancy = {
  table: RowData
  details?: VacancyDetails
  lastDetailsFetch: number
  keywords?: Keyword[]
}

export const [vacancyLookup, setVacancyLookup] = createStore<
  Record<string, Vacancy>
>({})

getLocalStorageItem('vacancy_lookup', {}).then(setVacancyLookup)

const updateLocalStorage = () =>
  setLocalStorageItem('vacancy_lookup', vacancyLookup)

export function addTableRow(data: RowData) {
  const key = data.itemNum
  setVacancyLookup(key, (d) => ({ ...d, table: data }))

  refreshStaleDetails(key)
  updateLocalStorage()
}

const STALE_MS = 60 * 60 * 1000
export function refreshStaleDetails(key: string) {
  if (!(key in vacancyLookup)) setVacancyLookup(key, {})
  if (
    !vacancyLookup[key]?.details ||
    Date.now() - (vacancyLookup[key]?.lastDetailsFetch ?? 0) > STALE_MS
  )
    refreshDetails(key)
}

export function refreshDetails(key: string) {
  getDataFromLink(getDetailsLink(key)).then((details) =>
    addDetails(key, details),
  )
}

export function refreshDetailsFromPage(key: string) {
  getDataFromPage(document).then((d) => addDetails(key, d))
}

export function addDetails(key: string, details: VacancyDetails) {
  setVacancyLookup(key, (d) => ({
    ...d,
    details,
    lastDetailsFetch: Date.now(),
    keywords: getKeywordsFromDetails(details),
  }))
  updateLocalStorage()
}
