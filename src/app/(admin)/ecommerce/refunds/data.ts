import { StaticImageData } from "next/image"
import product3 from "@/assets/images/products/03.png"
import product4 from "@/assets/images/products/04.png"
import product6 from "@/assets/images/products/06.png"
import product5 from "@/assets/images/products/05.png"
import product1 from "@/assets/images/products/01.png"

export type OrderDetailType = {
  productName: string
  description: string
  image: StaticImageData
  price: number,
  quantity: number,
  total: number
}

export const orderDetailsData: OrderDetailType[] = [
  {
    productName: "Royal Purse",
    description: "Pure Leather 100%",
    image: product3,
    price: 80,
    quantity: 3,
    total: 240
  },
  {
    productName: "Apple Watch",
    description: "Size-05 (Model 2021)",
    image: product4,
    price: 100,
    quantity: 1,
    total: 100
  },
  {
    productName: "Cosco Volleyball",
    description: "Size-04 (Model 2021)",
    image: product6,
    price: 20,
    quantity: 4,
    total: 80
  },
  {
    productName: "Reebok Shoes",
    description: "Size-08 (Model 2021)",
    image: product5,
    price: 50,
    quantity: 10,
    total: 500
  },
  {
    productName: "Modern Chair",
    description: "Size-Medium (Model 2021)",
    image: product1,
    price: 70,
    quantity: 2,
    total: 140
  }
]
