import { StaticImageData } from "next/image"
import gDriveImg from "@/assets/images/logos/lang-logo/gdrive.png"
import dropboxImg from "@/assets/images/logos/lang-logo/dropbox.png"
import oneDriveImg from "@/assets/images/logos/lang-logo/onedrive.png"
import serverImg from "@/assets/images/logos/lang-logo/server.png"

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

export type StateType = {
  name: string
  image: StaticImageData
  files: number
  usage: number
}

export const stateData: StateType[] = [
  {
    name: "Google Drive",
    image: gDriveImg,
    files: 34,
    usage: 38
  },
  {
    name: "Dropbox",
    image: dropboxImg,
    files: 68,
    usage: 15
  },
  {
    name: "Onedrive",
    image: oneDriveImg,
    files: 192,
    usage: 48
  },
  {
    name: "Server",
    image: serverImg,
    files: 81,
    usage: 76
  }
]

type DocsType = {
  name: string
  date: string
  size: string
  shared_with: StaticImageData[]
}
type ImgDocsType = {
  fileName: string
  date: string
  size: string
  sharedWith?: StaticImageData[]
}
type AudioDocsType = {
  fileName: string
  date: string
  size: string
}

export const docsData: DocsType[] = [
  {
    name: "payment.pdf",
    date: "18 Jul 2024",
    size: "2.3 MB",
    shared_with: [
      avatar2,
      avatar5,
      avatar3
    ],
  },
  {
    name: "statement.pdf",
    date: "08 Dec 2024",
    size: "3.7 MB",
    shared_with: [
      avatar3,
      avatar10
    ],
  },
  {
    name: "idcard.pdf",
    date: "30 Nov 2024",
    size: "1.5 MB",
    shared_with: [
      avatar7,
      avatar2
    ],
  },
  {
    name: "invoice.pdf",
    date: "09 Sep 2024",
    size: "3.2 MB",
    shared_with: [],
  },
  {
    name: "tutorial.pdf",
    date: "14 Aug 2024",
    size: "12.7 MB",
    shared_with: [
      avatar2,
      avatar3,
      avatar8
    ],
  },
  {
    name: "project.pdf",
    date: "12 Aug 2024",
    size: "5.2 MB",
    shared_with: [
      avatar1,
      avatar4,
      avatar6
    ],
  }
]

export const imgDocsData: ImgDocsType[] = [
  {
    fileName: "img52315.jpeg",
    date: "18 Jul 2024",
    size: "2.3 MB",
    sharedWith: [avatar2, avatar5, avatar3],
  },
  {
    fileName: "img63695.jpeg",
    date: "08 Dec 2024",
    size: "3.7 MB",
    sharedWith: [avatar3, avatar10],
  },
  {
    fileName: "img00021.jpeg",
    date: "30 Nov 2024",
    size: "1.5 MB",
    sharedWith: [avatar7, avatar2],
  },
  {
    fileName: "img36251.jpeg",
    date: "09 Sep 2024",
    size: "3.2 MB",
  },
  {
    fileName: "img362511.jpeg",
    date: "14 Aug 2024",
    size: "12.7 MB",
    sharedWith: [avatar2, avatar3, avatar8],
  },
  {
    fileName: "img963852.jpeg",
    date: "12 Aug 2024",
    size: "5.2 MB",
    sharedWith: [avatar1, avatar4, avatar6],
  }
]

export const audioDocsData: AudioDocsType[] = [
  {
    fileName: "audio52315",
    date: "18 Jul 2024",
    size: "2.3 MB",
  },
  {
    fileName: "audio63695",
    date: "08 Dec 2024",
    size: "3.7 MB",
  },
  {
    fileName: "audio00021",
    date: "30 Nov 2024",
    size: "1.5 MB",
  },
  {
    fileName: "audio36251",
    date: "09 Sep 2024",
    size: "3.2 MB",
  },
  {
    fileName: "audio362511",
    date: "14 Aug 2024",
    size: "12.7 MB",
  },
  {
    fileName: "audio963852",
    date: "12 Aug 2024",
    size: "5.2 MB",
  }
]
