import { StaticImageData } from "next/image"
import product1img from "@/assets/images/products/01.png"
import product2img from "@/assets/images/products/02.png"
import product3img from "@/assets/images/products/03.png"
import product4img from "@/assets/images/products/04.png"

export type StateType = {
  label: string
  value: string
}
export type EarningReportType = {
  date: string
  itemCount: number
  text: string,
  textType?: string,
  earnings: string
}

type PopularProductType = {
  productName: string,
  productId: string,
  image: StaticImageData,
  price: string,
  originalPrice: string,
  stock: number,
  sold: number,
  availability: string
}

export const stateData: StateType[] = [
  {
    label: "Weekly Sales",
    value: "$24,500",
  },
  {
    label: "Orders Placed",
    value: "520",
  },
  {
    label: "Conversion Rate",
    value: "82.8%",
  },
  {
    label: "Avg. Value",
    value: "$80.5",
  }
]

export const earningReportData: EarningReportType[] = [
  {
    date: "01 January",
    itemCount: 50,
    text: "-$70",
    textType: "danger",
    earnings: "$15,000"
  },
  {
    date: "02 January",
    itemCount: 25,
    text: "-",
    earnings: "$9,500"
  },
  {
    date: "03 January",
    itemCount: 65,
    text: "-$115",
    textType: "danger",
    earnings: "$35,000"
  },
  {
    date: "04 January",
    itemCount: 20,
    text: "-",
    earnings: "$8,500"
  },
  {
    date: "05 January",
    itemCount: 40,
    text: "-$60",
    textType: "danger",
    earnings: "$12,000"
  },
  {
    date: "06 January",
    itemCount: 45,
    text: "-$65",
    textType: "danger",
    earnings: "$13,500"
  }
]

export const popularProductData : PopularProductType[]= [
  {
    productName: "Dastone Cotten Toy (colorful)",
    productId: "A3652",
    image: product1img,
    price: "$50",
    originalPrice: "$70",
    stock: 450,
    sold: 550,
    availability: "Stock"
  },
  {
    productName: "Dastone Watch",
    productId: "A4454",
    image: product2img,
    price: "$99",
    originalPrice: "$150",
    stock: 750,
    sold: 0,
    availability: "Out of Stock"
  },
  {
    productName: "Dastone Headphone (Gray)",
    productId: "A5632",
    image: product3img,
    price: "$199",
    originalPrice: "$250",
    stock: 280,
    sold: 220,
    availability: "Stock"
  },
  {
    productName: "Dastone Dark Coffee",
    productId: "A9632",
    image: product4img,
    price: "$40",
    originalPrice: "$49",
    stock: 500,
    sold: 1000,
    availability: "Out of Stock"
  }
]
