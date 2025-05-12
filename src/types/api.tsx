export interface User {
  id: string
  user_name: string
  email: string
  is_active: boolean
  is_superuser: boolean
}

export interface Course {
  id: number
  title: string
  description: string
}
