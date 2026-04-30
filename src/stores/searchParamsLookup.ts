import {
  getLocalStorageItem,
  localStoreItemExists,
  setLocalStorageItem,
} from '@/util/localStorage'
import { createSignal } from 'solid-js'

import { useWaitForElt, useWaitForElts } from '@/util/useWaitForElt'
import { getPathInformation } from '@/util/pathInformation'

export interface SearchParamsLookup {
  CATEGORIES: Record<string, string>
  REGIONS: Record<string, string>
  JURIS_IDS: Record<string, string>
  AGENCY: Record<string, string>
}

const KEY = 'search-params-lookup'

const EMPTY = {
  CATEGORIES: {},
  REGIONS: {},
  JURIS_IDS: {},
  AGENCY: {},
}

export function getSearchParamsLookup() {
  const [signal, setSignal] = createSignal<SearchParamsLookup>(EMPTY)

  const pageContext = getPathInformation()
  if (pageContext.page == 'search')
    getSearchParamsFromSearchPage(document).then((params) => {
      if (!params) return
      setSignal(params)
      setLocalStorageItem(KEY, params)
    })
  else {
    localStoreItemExists(KEY)
      .then((exists) =>
        exists
          ? getLocalStorageItem(KEY, EMPTY)
          : fetchSearchParams(
              `${document.location.origin}/${pageContext.root}/search.cfm`,
            ),
      )
      .then((params) => {
        if (!params) return
        setSignal(params)
        setLocalStorageItem(KEY, params)
      })
  }

  return signal
}

async function fetchSearchParams(link: string) {
  return fetch(link)
    .then((r) => r.text())
    .then((htmlText) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlText, 'text/html')
      return getSearchParamsFromSearchPage(doc)
    })
}

async function getSearchParamsFromSearchPage(
  doc: Document,
): Promise<SearchParamsLookup | undefined> {
  const jurisClass = await useWaitForElt('select#JurisClassID', doc)
  const agency = await useWaitForElt('select#AgID', doc)

  const categories = await getFieldsetByLegend(
    'Include Occupational Categories',
    doc,
  )
  if (!categories) return

  const regions = await getFieldsetByLegend('Include Regions', doc)
  if (!regions) return

  return {
    CATEGORIES: Object.fromEntries(
      [...categories.querySelectorAll('input')].map((el) => [
        el.value,
        el.labels?.item(0).textContent ?? '',
      ]),
    ),
    REGIONS: Object.fromEntries(
      [...regions.querySelectorAll('input')].map((el) => [
        el.value,
        el.labels?.item(0).textContent ?? '',
      ]),
    ),
    JURIS_IDS: Object.fromEntries(
      [...jurisClass.querySelectorAll('option')].map((option) => [
        option.value,
        option.textContent,
      ]),
    ),
    AGENCY: Object.fromEntries(
      [...agency.querySelectorAll('option')].map((option) => [
        option.value,
        option.textContent,
      ]),
    ),
  }
}

const getFieldsetByLegend = async (legendText: string, doc: Document) => {
  const fieldsets = await useWaitForElts<HTMLFieldSetElement>(
    'fieldset',
    doc,
  ).then((elts) => [...elts])
  return fieldsets.find(
    (elt) => elt.querySelector('legend')?.textContent == legendText,
  )
}
