import { useAuth } from "@/context/auth/useAuth"
import { cn } from "@/lib/utils"

interface Props {
  className?: string
  children?: React.ReactNode
}

function AdminEditButtons({ className, children }: Props) {
  const { isAdmin } = useAuth()
  const styles = cn("flex gap-2", className)

  if (!isAdmin) return null

  return <div className={styles}>{children}</div>
}

export default AdminEditButtons
