import { Component, createEffect, Index, Show } from 'solid-js'
import { getSearchParams } from '@/util/searchParams'
import KeyValue from '@/components/KeyValue'
import { getSearchParamsLookup } from '@/stores/searchParamsLookup'

interface SearchData {
  Keywords: string
  title: string
  jurisdictional_class: string
  agency: string
  isnyhelp: string
  minDate: string
  maxDate: string
  flextime: boolean
  compressed: boolean
  telecommuting: boolean
  categories: string[]
  regions: string[]
  employmentType: string
  gradeCompareType: string
  grade: string
  SalMin: string
}

const SearchParams: Component = () => {
  const searchParamsLookup = getSearchParamsLookup()
  const params = () =>
    getSearchParams(document.location.search, searchParamsLookup())

  createEffect(() => console.log(params()))

  const items = () => [
    { title: 'Keyword Search:', value: () => params().Keywords },
    { title: 'Title Search:', value: () => params().title },
    {
      title: 'Jurisdiction Class:',
      value: () => params().jurisdictional_class,
    },
    { title: 'Agency:', value: () => params().agency },
    { title: 'NY Helps:', value: () => params().isnyhelp },
    {
      title: 'Date Range:',
      value: () =>
        (params().minDate || params().maxDate) &&
        params().minDate + ' - ' + params().maxDate,
    },
    { title: 'Flextime Allowed:', value: () => params().flextime },
    { title: 'Compressed Work Week:', value: () => params().compressed },
    { title: 'Telecommuting:', value: () => params().telecommuting },
    { title: 'Categories:', value: () => params().categories },
    { title: 'Regions:', value: () => params().regions },
    { title: 'Employment Type:', value: () => params().employmentType },
    {
      title: 'Grade:',
      value: () =>
        params().grade && params().gradeCompareType + ' ' + params().grade,
    },
    { title: 'Salary Minimum:', value: () => params().SalMin },
  ]

  return (
    <div>
      <div class="nys-font-h3"> Search Criteria </div>
      <div>
        <Index each={items()}>
          {(item) => (
            <Show when={item().value()?.length}>
              <KeyValue
                label={item().title}
                value={item().value()}
              ></KeyValue>
            </Show>
          )}
        </Index>
      </div>
      <nys-divider class="nys-margin-50"></nys-divider>
    </div>
  )
}

export default SearchParams
