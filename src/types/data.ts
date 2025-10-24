import { StaticImageData } from "next/image"

export type IdType = string

export type KanbanSectionType = {
  id: IdType
  title: string
}


export type PriorityType = 'Low' | 'Medium' | 'High'

export type KanbanTaskTag = 'API' | 'Form Submit' | 'Responsive'

export type KanbanTaskType = {
  id: IdType
  sectionId: KanbanSectionType['id']
  section?: KanbanSectionType
  title: string
  description?: string
  image?: StaticImageData
  priority: PriorityType
  tags?: KanbanTaskTag[]
  totalTasks: number
  completedTasks: number
  commentsCount: number
}


export type UserType = {
  id: IdType
  name: string
  avatar: StaticImageData
  handle: string
  email: string
  phoneNo: string
  role: string
  lastActivity: Date
  activityStatus: 'typing' | 'online' | 'offline'
  lastMessage: string
  unreadCount?: number
  status: 'Active' | 'Inactive'
  source: string
}

export type ProductType = {
  id: IdType
  name: string
  description: string
  image: StaticImageData
  category: string
  pics: number
  price: number
  sellPrice: number
  sellsCount: number
  status: 'In Stock' | 'Out of Stock' | 'Published' | 'Inactive'
  createdAt: Date
  paymentType: 'UPI' | 'Banking' | 'Paypal' | 'BTC'
}

export type CustomerType = {
  id: IdType
  name: string
  avatar: StaticImageData
  email: string
  order: number
  spend: number
  city: string
  startDate: Date
  completion: number
  status: 'Repeat' | 'Inactive' | 'New'
}

export type ProjectsType = {
  title: string
  client: string
  logo: StaticImageData
  start_date: string,
  deadline: string,
  progress: number
  all_hours: string
  today_hours: string
  days_left: number,
  team: StaticImageData[]
  tasks_completed: string
  progressColor?: string
}

export type ChatMessageType = {
  id: IdType
  from: UserType
  to: UserType
  message: string
  sentOn: Date
}

export type FolderType = {
  title: string
  image: StaticImageData
  files: number
  storage: string
  progress: number
}

export type PricingType = {
  name: string
  description: string
  price: number
  features: string[]
  icon: string
  isPopular?: boolean
  iconVariant: string
}
