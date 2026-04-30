import { VacancyDetails } from '../parsing/VacancyDetails'
// import skills from '../data/skills.json'
const skills2 = await import('../data/skills_blank.json')
const skills = skills2.default as any[]

export interface Keyword {
  title: string
  keyword: string
}
const getRegexForWord = (word: string) =>
  new RegExp(
    `\\b${word.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}\\b`,
  )

export function getKeywordsFromDetails(info: VacancyDetails | undefined) {
  if (!info) return []
  const text = [
    info.jobspecifics.dutiesDescription.content,
    info.jobspecifics.minimumQualifications.content,
  ]
    .join(' ')
    .toLowerCase()

  const keywords: Keyword[] = []
  for (const skill of skills) {
    for (const keyword of skill.skills) {
      if (getRegexForWord(keyword).test(text)) {
        keywords.push({ title: skill.title, keyword })
      }
    }
  }
  return keywords
}

export function boldKeywords(text: string) {
  let returnValue = text
  for (const skill of skills) {
    for (const keyword of skill.skills) {
      const regexExec = getRegexForWord(keyword).exec(text)

      if (regexExec != null) {
        returnValue = `${text.slice(0, regexExec.index)}<b>${text.slice(regexExec.index, regexExec[0].length + regexExec.index)}</b>${text.slice(regexExec[0].length + regexExec.index)}`
      }
    }
  }

  return returnValue
}
