import { createSignal } from 'solid-js'

export interface TableInfo {
  start: number
  end: number
  total: number
  pageSize: number
}

export type TableData = TableInfo & {
  rows: RowData[]
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

export function getReactivePageData(document: Document) {
  const [data, setData] = createSignal(getTableData(document))

  console.log(getTableInfoFromPage(document))

  const observer = new MutationObserver(() => setData(getTableData(document)))
  const table = document.querySelector('table#vacancyTable')
  if (table)
    observer.observe(table, {
      childList: true,
      subtree: true,
    })

  return data
}

export function getTableData(document: Document): TableData {
  return {
    ...getTableInfoFromPage(document),
    rows: getRowsFromPage(document),
  }
}

const TABLE_INFO_REGEX =
  /^Showing (?<start>\d+) to (?<end>\d+) of (?<total>\d+) entries( \(filtered from (?<from>\d+) total entries\))?$/i

export function getTableInfoFromPage(document: Document): TableInfo {
  const tableInfo = document.querySelector('div#vacancyTable_info')
  const regexInfo = TABLE_INFO_REGEX.exec(tableInfo?.textContent ?? '')
  const select = document.querySelector<HTMLSelectElement>('select#dt-length-0')

  return {
    start: Number(regexInfo?.groups?.start) ?? 0,
    end: Number(regexInfo?.groups?.end) ?? 0,
    total: Number(regexInfo?.groups?.total) ?? 0,
    pageSize: Number(select?.value) ?? 0,
  }
}

export function getRowsFromPage(document: Document) {
  const rows = document.querySelectorAll('table#vacancyTable > tbody > tr')
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
    rawData.push(value)
  }

  return rawData
}
