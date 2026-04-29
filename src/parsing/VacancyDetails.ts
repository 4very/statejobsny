import { useWaitForElt, useWaitForElts } from '../util/useWaitForElt'

export const sections = [
  ['information', 'Information'],
  ['schedule', 'Schedule'],
  ['location', 'Location'],
  ['jobspecifics', 'Job Specifics'],
  ['contact', 'How to Apply'],
]
export interface DetailsItem {
  title: string
  content: string
  helpText?: string
  raw: string | undefined
}

export type VacancyDetails = {
  reviewInformation: {
    datePosted: DetailsItem
    applicationsDue: DetailsItem
    vacancyID: DetailsItem
  }
  information: {
    nYHELP: DetailsItem
    agency: DetailsItem
    title: DetailsItem
    occupationalCategory: DetailsItem
    salaryGrade: DetailsItem
    bargainingUnit: DetailsItem
    salaryRange: DetailsItem
    employmentType: DetailsItem
    appointmentType: DetailsItem
    jurisdictionalClass: DetailsItem
    travelPercentage: DetailsItem
  }
  schedule: {
    workweek: DetailsItem
    hoursPerWeek: DetailsItem
    from: DetailsItem
    to: DetailsItem
    'flextimeAllowed?': DetailsItem
    'mandatoryOvertime?': DetailsItem
    'compressedWorkweekAllowed?': DetailsItem
    'telecommutingAllowed?': DetailsItem
  }
  location: {
    county: DetailsItem
    streetAddress: DetailsItem
    city: DetailsItem
    state: DetailsItem
    zipCode: DetailsItem
  }
  jobspecifics: {
    dutiesDescription: DetailsItem
    minimumQualifications: DetailsItem
    additionalComments: DetailsItem
  }
  contact: {
    name: DetailsItem
    telephone: DetailsItem
    fax: DetailsItem
    emailAddress: DetailsItem
    street: DetailsItem
    city: DetailsItem
    state: DetailsItem
    zipCode: DetailsItem
    notesOnApplying: DetailsItem
  }
}

export async function getDataFromLink(link: string) {
  return fetch(link)
    .then((r) => r.text())
    .then((htmlText) => {
      const parser = new DOMParser()
      const document = parser.parseFromString(htmlText, 'text/html')
      return getDataFromPage(document)
    })
}

export async function getDataFromPage(doc: Document) {
  const returnValue: Record<string, Record<string, DetailsItem>> = {}

  // await useWaitForElt('div.columnReport a.help')
  const columnReport = await useWaitForElt('div.columnReport', doc)
  returnValue['reviewInformation'] = parseRows(
    await useWaitForElts('p.row', columnReport),
  )

  sections.forEach(([section]) =>
    useWaitForElts(`#${section} > p.row`, doc).then(
      (rows) => (returnValue[section] = parseRows(rows)),
    ),
  )

  return returnValue as VacancyDetails
}

function parseRows(elts: NodeListOf<Element>) {
  const returnValue: Record<string, DetailsItem> = {}
  let lastKey: string
  elts.forEach((elt) => {
    const parsedValue = parseRow(elt)
    if (!parsedValue) return
    let key = camelize(parsedValue.title)

    if (key == '') {
      const lastValue = returnValue[lastKey]

      returnValue[lastKey] = {
        ...lastValue,
        raw: lastValue.raw + '<br/>' + parsedValue.raw,
        content: lastValue.content + '\n' + parsedValue.content,
      }
    } else {
      returnValue[camelize(parsedValue.title)] = parsedValue
    }
    lastKey = key
  })
  return returnValue
}
function parseRow(elt: Element | null): DetailsItem | undefined {
  if (!elt) return
  const leftCol = elt.querySelector('span.leftCol')
  const rightCol = elt.querySelector('span.rightCol')

  const helpButton = leftCol?.querySelector<HTMLSpanElement>('a.help')

  let returnValue: DetailsItem = {
    title: getTextContentFromTextNodesOnly(leftCol),
    content: getTextContentFromTextNodesOnly(rightCol),
    raw: rightCol?.innerHTML,
    helpText: helpButton?.title || helpButton?.textContent,
  }
  return returnValue
}
function getTextContentFromTextNodesOnly(elt: Element | null) {
  if (!elt) return ''
  return [...elt.childNodes]
    .filter(
      (node) => node.nodeType === Node.TEXT_NODE || node.nodeName === 'BR',
    )
    .map((n) => (n.nodeType === Node.TEXT_NODE ? n.textContent : '\n'))
    .join(' ')
    .trim()
}
function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}
