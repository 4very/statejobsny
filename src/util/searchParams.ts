import { SearchParamsLookup } from '@/stores/searchParamsLookup'

interface SearchData {
  Keywords: string
  title: string
  jurisdictional_class: string | undefined
  agency: string | undefined
  isnyhelp: 'Yes' | 'No' | ''
  minDate: string
  maxDate: string
  flextime: 'Yes' | 'No'
  compressed: 'Yes' | 'No'
  telecommuting: 'Yes' | 'No'
  categories: string[]
  regions: string[]
  employmentType: 'Part-Time' | 'Full-Time' | ''
  gradeCompareType: 'GT' | 'LT' | 'EQ'
  grade: string
  SalMin: string
}

export function getUrlParams(search: string) {
  return new URLSearchParams(search)
}

export function getSearchParams(
  search: string,
  searchParamsLookup: SearchParamsLookup,
) {
  const loc = new URLSearchParams(search)
  const cats = [...loc.entries()]
    .filter(([key, value]) => key.startsWith('cat') && key.endsWith(value))
    .map(([_, value]) => searchParamsLookup.CATEGORIES[value])

  const regions = [...loc.entries()]
    .filter(([key, value]) => key.startsWith('region') && key.endsWith(value))
    .map(([_, value]) => searchParamsLookup.REGIONS[value])

  const returnValue = {
    ...Object.fromEntries(loc.entries()),
    categories: cats,
    regions: regions,
    jurisdictional_class:
      searchParamsLookup.JURIS_IDS[loc.get('JurisClassID') ?? ''],
    agency: searchParamsLookup.AGENCY[loc.get('AgID') ?? ''],
  } as SearchData

  return returnValue
}
