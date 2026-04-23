import { jobInformation } from '../pages/details/data'
import skills from '../data/skills.json'

export interface Keyword {
  title: string
  keyword: string
}
const getRegexForWord = (word: string) =>
  new RegExp(
    `\\b${word.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}\\b`,
  )

export function getKeywordsFromDetails(info: jobInformation | undefined) {
  if (!info) return []
  const text = [
    info.jobspecifics.dutiesDescription.content,
    info.jobspecifics.minimumQualifications.content,
  ]
    .join()
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
