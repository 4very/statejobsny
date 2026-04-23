const sections = [
  'information',
  'schedule',
  'location',
  'jobspecifics',
  'contact',
]

interface dataEntry {
  title: string
  content: string
  helpText?: string
  raw: () => Node | undefined
}

export type jobInformation = {
  reviewInformation: {
    datePosted: dataEntry
    applicationsDue: dataEntry
    vacancyID: dataEntry
  }
  information: {
    nYHELP: dataEntry
    agency: dataEntry
    title: dataEntry
    occupationalCategory: dataEntry
    salaryGrade: dataEntry
    bargainingUnit: dataEntry
    salaryRange: dataEntry
    employmentType: dataEntry
    appointmentType: dataEntry
    jurisdictionalClass: dataEntry
    travelPercentage: dataEntry
  }
  schedule: {
    workweek: dataEntry
    hoursPerWeek: dataEntry
    from: dataEntry
    to: dataEntry
    'flextimeAllowed?': dataEntry
    'mandatoryOvertime?': dataEntry
    'compressedWorkweekAllowed?': dataEntry
    'telecommutingAllowed?': dataEntry
  }
  location: {
    county: dataEntry
    streetAddress: dataEntry
    '': dataEntry
    city: dataEntry
    state: dataEntry
    zipCode: dataEntry
  }
  jobspecifics: {
    dutiesDescription: dataEntry
    minimumQualifications: dataEntry
    additionalComments: dataEntry
  }
  contact: {
    name: dataEntry
    telephone: dataEntry
    fax: dataEntry
    emailAddress: dataEntry
    street: dataEntry
    '': dataEntry
    city: dataEntry
    state: dataEntry
    zipCode: dataEntry
    notesOnApplying: dataEntry
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
  const returnValue: Record<string, Record<string, dataEntry>> = {}
  const reviewInformation = document.querySelectorAll(
    'div.columnReport > p.row',
  )
  returnValue['reviewInformation'] = parseRows(reviewInformation)

  for (const section of sections) {
    const sectionRows = document.querySelectorAll(`#${section} > p.row`)
    returnValue[section] = parseRows(sectionRows)
  }
  // console.log(returnValue)
  return returnValue as jobInformation
}

function parseRows(elts: NodeListOf<Element>) {
  const returnValue: Record<string, dataEntry> = {}
  elts.forEach((elt) => {
    const parsedValue = parseRow(elt)
    if (!parsedValue) return
    returnValue[camelize(parsedValue.title)] = parsedValue
  })
  return returnValue
}

function parseRow(elt: Element | null): dataEntry | undefined {
  if (!elt) return
  const leftCol = elt.querySelector('span.leftCol')
  const rightCol = elt.querySelector('span.rightCol')

  const helpButton = elt.querySelector('a.help')

  const rightColNode = rightCol?.cloneNode(true)

  let returnValue: dataEntry = {
    title: getTextContentFromTextNodesOnly(leftCol),
    content: getTextContentFromTextNodesOnly(rightCol),
    raw: () => rightColNode?.cloneNode(true),
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
