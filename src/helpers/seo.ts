import { DEFAULT_PAGE_TITLE } from '@/context/constants'

export const Seo = (pageTitle?: string) => {
  if (!pageTitle) return DEFAULT_PAGE_TITLE
  return `${pageTitle} | ${DEFAULT_PAGE_TITLE}`
}