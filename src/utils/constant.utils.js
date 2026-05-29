import { env } from '@/config/environment'

export const WHITE_LIST_DOMAINS = [
  'http://localhost:3000'
]

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 10

export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin'
}

export const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
}