const sections = [
  'information',
  'schedule',
  'location',
  'jobspecifics',
  'contact',
]
interface Value {
  title: string
  content: string
  helpText?: string
  raw: string | undefined
}

export type VacancyDetails = {
  reviewInformation: {
    datePosted: Value
    applicationsDue: Value
    vacancyID: Value
  }
  information: {
    nYHELP: Value
    agency: Value
    title: Value
    occupationalCategory: Value
    salaryGrade: Value
    bargainingUnit: Value
    salaryRange: Value
    employmentType: Value
    appointmentType: Value
    jurisdictionalClass: Value
    travelPercentage: Value
  }
  schedule: {
    workweek: Value
    hoursPerWeek: Value
    from: Value
    to: Value
    'flextimeAllowed?': Value
    'mandatoryOvertime?': Value
    'compressedWorkweekAllowed?': Value
    'telecommutingAllowed?': Value
  }
  location: {
    county: Value
    streetAddress: Value
    '': Value
    city: Value
    state: Value
    zipCode: Value
  }
  jobspecifics: {
    dutiesDescription: Value
    minimumQualifications: Value
    additionalComments: Value
  }
  contact: {
    name: Value
    telephone: Value
    fax: Value
    emailAddress: Value
    street: Value
    '': Value
    city: Value
    state: Value
    zipCode: Value
    notesOnApplying: Value
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

export function getDataFromPage(document: Document) {
  const returnValue: Record<string, Record<string, Value>> = {}
  const reviewInformation = document.querySelectorAll(
    'div.columnReport > p.row',
  )
  returnValue['reviewInformation'] = parseRows(reviewInformation)

  for (const section of sections) {
    const sectionRows = document.querySelectorAll(`#${section} > p.row`)
    returnValue[section] = parseRows(sectionRows)
  }
  // console.log(returnValue)
  return returnValue as VacancyDetails
}
function parseRows(elts: NodeListOf<Element>) {
  const returnValue: Record<string, Value> = {}
  elts.forEach((elt) => {
    const parsedValue = parseRow(elt)
    if (!parsedValue) return
    returnValue[camelize(parsedValue.title)] = parsedValue
  })
  return returnValue
}
function parseRow(elt: Element | null): Value | undefined {
  if (!elt) return
  const leftCol = elt.querySelector('span.leftCol')
  const rightCol = elt.querySelector('span.rightCol')

  const helpButton = elt.querySelector('a.help')

  let returnValue: Value = {
    title: getTextContentFromTextNodesOnly(leftCol),
    content: getTextContentFromTextNodesOnly(rightCol),
    raw: rightCol?.innerHTML,
  }
  if (helpButton) returnValue['helpText'] = helpButton.textContent.trim()
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
