import { StaticImageData } from "next/image"
import avatar1 from "@/assets/images/users/avatar-1.jpg"
import avatar2 from "@/assets/images/users/avatar-2.jpg"
import avatar3 from "@/assets/images/users/avatar-3.jpg"
import avatar4 from "@/assets/images/users/avatar-4.jpg"
import avatar5 from "@/assets/images/users/avatar-5.jpg"
import avatar6 from "@/assets/images/users/avatar-6.jpg"
import avatar7 from "@/assets/images/users/avatar-7.jpg"
import avatar8 from "@/assets/images/users/avatar-8.jpg"
import avatar9 from "@/assets/images/users/avatar-9.jpg"
import chatgptImg from "@/assets/images/logos/lang-logo/chatgpt.png"
import nextjsImg from "@/assets/images/logos/lang-logo/nextjs.png"
import slackImg from "@/assets/images/logos/lang-logo/slack.png"


export type StateType = {
  type: string
  value: string
  description?: string
  icon: string
  variant: string
  active?: boolean
}



export type ActivityType = {
  user: string
  activity: string
  time: string,
  icon?: string
  avatar?: StaticImageData
}
export type AllProjectType = {
  project: string
  manager: string
  image: StaticImageData
  startDate: string
  endDate: string
  status: "Active" | "Pending" | "Complete"
  progress: number
}

export const stateData: StateType[] = [
  {
    type: "Empresas Ativas",
    value: '18',
    variant: 'primary',
    icon: 'iconoir:suitcase'
  },
  {
    type: "Usuários Cadastrados",
    value: '2328 ',
    variant: 'info',
    icon: 'iconoir:user',

  },
  {
    type: "Questionários Ativos",
    value: "58",
    variant: 'pink',
    icon: 'iconoir:okrs'
  },
  {
    type: "Manual de Uso",
    value: "como usar?",
    variant: 'blue',
    
    icon: 'iconoir:play'
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

export const allProjectData: AllProjectType[] = [
  {
    project: "Product Development",
    manager: "Kevin J. Heal",
    image: avatar2,
    startDate: "20/3/2020",
    endDate: "5/5/2020",
    status: "Active",
    progress: 92
  },
  {
    project: "New Office Building",
    manager: "Frank M. Lyons",
    image: avatar3,
    startDate: "11/6/2020",
    endDate: "15/7/2020",
    status: "Pending",
    progress: 0
  },
  {
    project: "Website & Blog",
    manager: "Hyman M. Cross",
    image: avatar4,
    startDate: "21/6/2020",
    endDate: "3/7/2020",
    status: "Pending",
    progress: 0
  },
  {
    project: "Market Research",
    manager: "Angelo E. Butler",
    image: avatar5,
    startDate: "30/4/2020",
    endDate: "1/6/2020",
    status: "Active",
    progress: 78
  },
  {
    project: "Export Marketing",
    manager: "Robert C. Golding",
    image: avatar6,
    startDate: "20/3/2020",
    endDate: "5/5/2020",
    status: "Active",
    progress: 45
  },
  {
    project: "New Office Building",
    manager: "Frank M. Lyons",
    image: avatar3,
    startDate: "11/6/2020",
    endDate: "15/7/2020",
    status: "Pending",
    progress: 0
  },
  {
    project: "Website & Blog",
    manager: "Hyman M. Cross",
    image: avatar4,
    startDate: "21/6/2020",
    endDate: "3/7/2020",
    status: "Pending",
    progress: 0
  },
  {
    project: "Website & Blog",
    manager: "Phillip T. Morse",
    image: avatar8,
    startDate: "8/4/2020",
    endDate: "2/6/2020",
    status: "Complete",
    progress: 100
  }
]
