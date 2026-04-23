import lookups from '../data/lookups.json'

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

const { CATEGORIES, REGIONS, JURIS_IDS, AGENCY } = lookups as Record<
  keyof typeof lookups,
  Record<string, string>
>

export function getSearchParams(search: string) {
  const loc = new URLSearchParams(search)
  const cats = [...loc.entries()]
    .filter(([key, value]) => key.startsWith('cat') && key.endsWith(value))
    .map(([_, value]) => CATEGORIES[value])

  const regions = [...loc.entries()]
    .filter(([key, value]) => key.startsWith('region') && key.endsWith(value))
    .map(([_, value]) => REGIONS[value])

  const returnValue = {
    ...Object.fromEntries(loc.entries()),
    categories: cats,
    regions: regions,
    jurisdictional_class: JURIS_IDS[loc.get('JurisClassID') ?? ''],
    agency: AGENCY[loc.get('AgID') ?? ''],
  } as SearchData

  return returnValue
}
