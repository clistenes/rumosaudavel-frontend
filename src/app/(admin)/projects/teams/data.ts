import { StaticImageData } from "next/image"
import nextjsImg from "@/assets/images/logos/lang-logo/nextjs.png"
import avatar1 from "@/assets/images/users/avatar-1.jpg"
import avatar2 from "@/assets/images/users/avatar-2.jpg"
import avatar3 from "@/assets/images/users/avatar-3.jpg"
import avatar4 from "@/assets/images/users/avatar-4.jpg"
import avatar5 from "@/assets/images/users/avatar-5.jpg"
import avatar6 from "@/assets/images/users/avatar-6.jpg"
import avatar7 from "@/assets/images/users/avatar-7.jpg"
import avatar8 from "@/assets/images/users/avatar-8.jpg"
import avatar9 from "@/assets/images/users/avatar-9.jpg"
import avatar10 from "@/assets/images/users/avatar-10.jpg"
import chatgptImg from "@/assets/images/logos/lang-logo/chatgpt.png"
import reactJsImg from "@/assets/images/logos/lang-logo/reactjs.png"
import svelteImg from "@/assets/images/logos/lang-logo/svelte.png"
import metaImg from "@/assets/images/logos/lang-logo/meta.png"
import vueImg from "@/assets/images/logos/lang-logo/vue.png"


export type TeamsType = {
  name: string
  logo: StaticImageData
  status: string
  status_color: string
  leader: {
    name: string
    role: string
    avatar: StaticImageData
  },
  team: StaticImageData[]
  extra_members: number
}

export const teamsData: TeamsType[] = [
  {
    name: "Next.js",
    logo: nextjsImg,
    status: "Available",
    status_color: "text-success",
    leader: {
      name: "Carol Maier",
      role: "Team Leader",
      avatar: avatar10
    },
    team: [
      avatar1,
      avatar4,
      avatar6,
      avatar5,
      avatar7
    ],
    extra_members: 6,
  },
  {
    name: "ChatGPT",
    logo: chatgptImg,
    status: "Available",
    status_color: "text-success",
    leader: {
      name: "Sandra Lally",
      role: "Team Leader",
      avatar: avatar9
    },
    team: [
      avatar2,
      avatar5,
      avatar7,
      avatar8,
      avatar9
    ],
    extra_members: 4,
  },
  {
    name: "React.js",
    logo: reactJsImg,
    status: "Not Available",
    status_color: "text-danger",
    leader: {
      name: "Scott Holland",
      role: "Team Leader",
      avatar: avatar2
    },
    team: [
      avatar9,
      avatar8,
      avatar7,
      avatar6,
      avatar5
    ],
    extra_members: 2,
  },
  {
    name: "Svelte",
    status: "Available",
    status_color: "success",
    logo: svelteImg,
    leader: {
      name: "Mike Gillam",
      role: "Team Leader",
      avatar: avatar5
    },
    team: [
      avatar1,
      avatar4,
      avatar6,
      avatar5,
      avatar7,
    ],
    extra_members: 6
  },
  {
    name: "Meta",
    status: "Not Available",
    status_color: "danger",
    logo: metaImg,
    leader: {
      name: "Angela McGary",
      role: "Team Leader",
      avatar: avatar8
    },
    team: [
      avatar2,
      avatar5,
      avatar7,
      avatar8,
      avatar9,
    ],
    extra_members: 4
  },
  {
    name: "Vue js",
    status: "Available",
    status_color: "success",
    logo: vueImg,
    leader: {
      name: "Gordon Aiello",
      role: "Team Leader",
      avatar: avatar4
    },
    team: [
      avatar9,
      avatar8,
      avatar7,
      avatar6,
      avatar5,
    ],
    extra_members: 2
  }
]

