

type StateType = {
  platform: string
  clicks: number
  icon: string
  color: string
}
type State2Type = {
  title: string
  value: string,
  progress: number,
}

export const stateData: StateType[] = [
  {
    platform: "Twitter",
    clicks: 2215,
    icon: "icofont-twitter",
    color: "secondary",
  },
  {
    platform: "Google",
    clicks: 3652,
    icon: "icofont-google-plus",
    color: "danger",
  },
  {
    platform: "Instagram",
    clicks: 2548,
    icon: "icofont-instagram",
    color: "warning",
  },
  {
    platform: "Facebook",
    clicks: 5242,
    icon: "icofont-facebook",
    color: "blue",
  }
]

export const state2Data: State2Type[] = [
  {
    title: "Total Customers",
    value: '38,321',
    progress: 65,
  },
  {
    title: "New Customers",
    value: '946',
    progress: 38,
  },
  {
    title: "Returning Customers",
    value: '70.8%',
    progress: 85,
  },
  {
    title: "Bounce Rate",
    value: '1.5%',
    progress: 40,
  }
]
