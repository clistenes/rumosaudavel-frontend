import { folders, pricingPlans, projects, users } from "@/assets/data/Other"
import { customers, products } from "@/assets/data/Product"
import { CustomerType, FolderType, PricingType, ProductType, ProjectsType, UserType } from "@/types/data"
import { sleep } from "@/utils/promise"



export const getAllProducts = async (): Promise<ProductType[]> => {
  await sleep()
  return products
}

export const getAllCustomers = async (): Promise<CustomerType[]> => {
  await sleep()
  return customers
}
export const getAllProject = async (): Promise<ProjectsType[]> => {
  await sleep()
  return projects
}

export const getUserById = async (id: UserType['id']): Promise<UserType | undefined> => {
  const data = users.find((user) => user.id === id)
  await sleep()
  return data
}

export const getAllUsers = async (): Promise<UserType[]> => {
  const data = users
  await sleep()
  return data
}

export const getAllPricingPlans = async (): Promise<PricingType[]> => {
  await sleep()
  return pricingPlans
}


export const getAllFolders = async (): Promise<FolderType[]> => {
  await sleep()
  return folders
}