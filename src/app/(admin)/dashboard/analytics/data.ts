import { StaticImageData } from "next/image"
import chatgptImg from "@/assets/images/logos/lang-logo/chatgpt.png"
import gitlabImg from "@/assets/images/logos/lang-logo/gitlab.png"
import metaImg from "@/assets/images/logos/lang-logo/meta.png"
import slackImg from "@/assets/images/logos/lang-logo/slack.png"
import avatar5 from "@/assets/images/users/avatar-5.jpg"
import avatar4 from "@/assets/images/users/avatar-4.jpg"

import chrome from '@/assets/images/logos/chrome.png'
import inExplorer from '@/assets/images/logos/in-explorer.png'
import microEdge from '@/assets/images/logos/micro-edge.png'
import opera from '@/assets/images/logos/opera.png'



export type StateType = {
  title: string,
  value: string,
  percentage: number,
  description: string,
  icon: string,
  color: string
  down?: boolean
}
export type PagesUsersType = {
  title: string
  file: string
  logo: StaticImageData
  views: number,
}

export type ActivityType = {
  user: string
  activity: string
  time: string,
  icon?: string
  avatar?: StaticImageData
}

export type BrowserAndTrafficType = {
  browserLogo: StaticImageData
  name: string
  sessions: {
    amount: number
    percentage: number
  }
  transactions: {
    amount: number
    percentage: number
  }
  bounceRate: number
}

export type VisitType = {
  name: string
  sessions: {
    amount: number
    percentage: number
  }
  period: {
    amount: number
    percentage: number
  }
  change: number
  changeVariant: 'success' | 'danger'
}

export const stateData: StateType[] = [
  {
    title: "Sessions",
    value: '24k',
    percentage: 8.5,
    description: "New Sessions Today",
    icon: "iconoir:user",
    color: "primary"
  },
  {
    title: "Avg. Sessions",
    value: "00:18",
    percentage: 1.5,
    description: "Weekly Avg. Sessions",
    icon: "iconoir:clock",
    color: "info"
  },
  {
    title: "Bounce Rate",
    value: '$2400',
    percentage: 35,
    down: true,
    description: "Bounce Rate Weekly",
    icon: "iconoir:activity",
    color: "pink"
  },
  {
    title: "Goal Completions",
    value: '85000',
    percentage: 10.5,
    description: "Completions Weekly",
    icon: "iconoir:handbag",
    color: "warning"
  }
]

export const pagesUsersData: PagesUsersType[] = [
  {
    title: "Dastone - Admin Dashboard",
    file: "analytic-index.html",
    logo: chatgptImg,
    views: 4.3,
  },
  {
    title: "Metrica Simple - Admin Dashboard",
    file: "sales-index.html",
    logo: gitlabImg,
    views: 3.7,
  },
  {
    title: "Crovex - Admin Dashboard",
    file: "helpdesk-index.html",
    logo: metaImg,
    views: 2.9,
  },
  {
    title: "Annex - Admin Dashboard",
    file: "calendar.html",
    logo: slackImg,
    views: 1.6,
  }
]

export const activityData: ActivityType[] = [
  {
    user: "Donald",
    activity: "updated the status of Refund #1234 to awaiting customer response",
    time: "10 Min ago",
    icon: "las la-user-clock"
  },
  {
    user: "Lucy Peterson",
    activity: "was added to the group, group name is Overtake",
    time: "50 Min ago",
    icon: "las la-stream",
  },
  {
    user: "Joseph Rust",
    activity: "opened new showcase Mannat #112233 with theme market",
    time: "10 hours ago",
    avatar: avatar5
  },
  {
    user: "Donald",
    activity: "updated the status of Refund #1234 to awaiting customer response",
    time: "Yesterday",
    icon: "las la-business-time"
  },
  {
    user: "Lucy Peterson",
    activity: "was added to the group, group name is Overtake",
    time: "14 Nov 2019",
    icon: "las la-exclamation-triangle",
  },
  {
    user: "Joseph Rust",
    activity: "opened new showcase Mannat #112233 with theme market",
    time: "15 Nov 2019",
    avatar: avatar4
  }
]

export const browserAndTrafficData: BrowserAndTrafficType[] = [
  {
    browserLogo: chrome,
    name: 'Chrome',
    sessions: {
      amount: 10853,
      percentage: 52,
    },
    bounceRate: 52.8,
    transactions: {
      amount: 566,
      percentage: 92,
    },
  },
  {
    browserLogo: microEdge,
    name: 'Microsoft Edge',
    sessions: {
      amount: 2545,
      percentage: 47,
    },
    bounceRate: 47.54,
    transactions: {
      amount: 498,
      percentage: 81,
    },
  },
  {
    browserLogo: inExplorer,
    name: 'Internet Explorer',
    sessions: {
      amount: 1836,
      percentage: 38,
    },
    bounceRate: 41.12,
    transactions: {
      amount: 455,
      percentage: 74,
    },
  },
  {
    browserLogo: opera,
    name: 'Opera',
    sessions: {
      amount: 1958,
      percentage: 31,
    },
    bounceRate: 36.82,
    transactions: {
      amount: 361,
      percentage: 61,
    },
  },
  {
    browserLogo: chrome,
    name: 'Chrome',
    sessions: {
      amount: 10853,
      percentage: 52,
    },
    bounceRate: 52.8,
    transactions: {
      amount: 566,
      percentage: 92,
    },
  },
]

export const visits: VisitType[] = [
  {
    name: 'Organic search',
    sessions: {
      amount: 10853,
      percentage: 52,
    },
    change: 52.8,
    period: {
      amount: 566,
      percentage: 92,
    },
    changeVariant: 'success',
  },
  {
    name: 'Direct',
    sessions: {
      amount: 2545,
      percentage: 47,
    },
    change: 17.2,
    period: {
      amount: 498,
      percentage: 81,
    },
    changeVariant: 'danger',
  },
  {
    name: 'Referral',
    sessions: {
      amount: 1836,
      percentage: 38,
    },
    change: 41.12,
    period: {
      amount: 455,
      percentage: 74,
    },
    changeVariant: 'success',
  },
  {
    name: 'Email',
    sessions: {
      amount: 1958,
      percentage: 31,
    },
    change: 8.24,
    period: {
      amount: 361,
      percentage: 61,
    },
    changeVariant: 'danger',
  },
  {
    name: 'Social',
    sessions: {
      amount: 10853,
      percentage: 52,
    },
    change: 29.33,
    period: {
      amount: 566,
      percentage: 92,
    },
    changeVariant: 'success',
  },
]

