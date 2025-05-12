import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth/useAuth"

function AdminDashboard() {
  const { user } = useAuth()

  if (!user?.is_superuser) {
    return <h1>You need admin rights!</h1>
  }

  return (
    <div>
      <h1>AdminDashboard</h1>
      <nav className="flex justify-center">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <Button>
              <Link to="/admin/new-course">New Course</Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link to="/admin/new-course">New User</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default AdminDashboard
