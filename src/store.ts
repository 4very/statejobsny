import { createStore } from 'solid-js/store'
import { RowData } from './parsing/VacancyTable'
import {
  getDataFromLink,
  getDataFromPage,
  VacancyDetails,
} from './parsing/VacancyDetails'
import { getKeywordsFromDetails, Keyword } from './util/keywords'
import { getLocalStorageItem, setLocalStorageItem } from './util/localStorage'

const DETAILS_LINK =
  'https://www.statejobsny.com/public/vacancyDetailsView.cfm?id='

type Vacancy = {
  table: RowData
  details?: VacancyDetails
  lastDetailsFetch: number
  keywords?: Keyword[]
}

export const [vacancyLookup, setVacancyLookup] = createStore<
  Record<string, Vacancy>
>(getLocalStorageItem('vacancy_lookup', {}))

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
  getDataFromLink(DETAILS_LINK + key).then((details) =>
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
