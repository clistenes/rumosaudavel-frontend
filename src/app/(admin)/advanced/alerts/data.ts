type AlertType = {
  title: string
  text?: string
  variant: string
  timer?: number
}

export const iconAlerts: AlertType[] = [
  {
    title: 'Your work has been saved',
    timer: 1500,
    variant: 'success',
  },
  {
    title: 'Oops...',
    text: 'Something went wrong!',
    variant: 'error',
  },
  {
    title: 'Oops...',
    text: 'Icon warning!',
    variant: 'warning',
  },
  {
    title: 'Oops...',
    text: 'Icon Info!',
    variant: 'info',
  },
]
