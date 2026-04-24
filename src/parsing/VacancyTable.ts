import { createEffect, createSignal } from 'solid-js'
import {
  useNullableMutationObserver,
  useWaitForElt,
} from '../util/useWaitForElt'
import { addTableRow } from '../store'

export interface TableInfo {
  items: {
    total: number
    start: number
    end: number
    from?: number
  }
  pages: {
    total: number
    current: number
    size: number
  }
}

export type TableData = TableInfo & {
  rows: string[]
}

export interface RowData {
  index: number
  itemNum: string
  title: string
  link: string
  grade: string
  posted: string
  deadline: string
  agency: string
  county: string
}

const SELECTORS = {
  table: 'table#vacancyTable',
  table_info: 'div#vacancyTable_info',
  lengthInput: 'select#dt-length-0',
  searchInput: 'input#dt-search-0',
  pageInput: 'div.dt-paging',
}

export function getAndWatchTableData() {
  const [tableData, setTableData] = createSignal<TableData | undefined>()
  console.log(getTableInfoFromPage().then(console.log))

  getTableData().then((r) => setTableData(r))

  createEffect(() => console.log(tableData()))
  useNullableMutationObserver(
    Object.values(SELECTORS),
    () => getTableData().then((r) => setTableData(r)),
    { childList: true, subtree: true },
  )

  return tableData
}

export async function getTableData(): Promise<TableData> {
  const rows = await getRowsFromPage()
  return {
    ...(await getTableInfoFromPage()),
    rows: rows.map((r) => r.itemNum),
  }
}

function createNumber(numStr: string | undefined) {
  return Number(numStr?.replace(',', '') ?? '0') ?? 0
}

const TABLE_INFO_REGEX =
  /^Showing (?<start>[\d,]+) to (?<end>[\d,]+) of (?<total>[\d,]+) entries( \(filtered from (?<from>[\d,]+) total entries\))?$/i

export async function getTableInfoFromPage(): Promise<TableInfo> {
  const tableInfo = await useWaitForElt(SELECTORS.table_info)
  const regexInfo = TABLE_INFO_REGEX.exec(tableInfo?.textContent ?? '')
  console.log(tableInfo)
  const lengthInput = await useWaitForElt<HTMLSelectElement>(
    SELECTORS.lengthInput,
  )
  const items = {
    start: createNumber(regexInfo?.groups?.start),
    end: createNumber(regexInfo?.groups?.end),
    total: createNumber(regexInfo?.groups?.total),
    from: regexInfo?.groups?.from
      ? createNumber(regexInfo?.groups?.from)
      : undefined,
  }

  const pageButtons = await useWaitForElt<HTMLDivElement>(SELECTORS.pageInput)
  const currentButton = pageButtons.querySelector('.current')

  const lastButton = pageButtons.querySelector('.dt-paging-button:has(+ .next)')

  const pages = {
    total: createNumber(lastButton?.textContent),
    current: createNumber(currentButton?.textContent),
    size: createNumber(lengthInput?.value),
  }

  if (!currentButton) {
    pages.current = Math.floor((items.start - 1) / pages.size) + 1
  }

  if (!lastButton) {
    pages.total = Math.floor((items.end - 1) / pages.size) + 1
  }

  return {
    items,
    pages,
  }
}

export async function getRowsFromPage() {
  const rows = (await useWaitForElt(SELECTORS.table)).querySelectorAll(
    'tbody > tr',
  )
  const rawData: RowData[] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const columns = [...row.querySelectorAll('td')]
    if (columns[0].classList.contains('dt-empty')) return rawData
    const value: RowData = {
      index: i,
      itemNum: columns[0].textContent.trim(),
      title: columns[1].textContent.trim(),
      link: columns[1].querySelector('a')?.href ?? '',
      grade: columns[2].textContent.trim(),
      posted: columns[3].textContent.trim(),
      deadline: columns[4].textContent.trim(),
      agency: columns[5].textContent.trim(),
      county: columns[6].textContent.trim(),
    }

    addTableRow(value)
    rawData.push(value)
  }

  return rawData
}
