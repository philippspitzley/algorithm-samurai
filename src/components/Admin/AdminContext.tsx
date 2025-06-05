import { useAuth } from "@/context/auth/useAuth"
import { cn } from "@/lib/utils"

interface Props {
  className?: string
  children?: React.ReactNode
}

function AdminEditButtons({ className, children }: Props) {
  const { user } = useAuth()
  const styles = cn("flex gap-2", className)

  if (!user || !user.is_superuser) return null

  return <div className={styles}>{children}</div>
}

export default AdminEditButtons
