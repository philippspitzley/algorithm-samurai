import { useEffect } from "react"

import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth/useAuth"

function AdminDashboard() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) {
      toast.error("No Permissions!", { description: "Sorry back to Home 😅" })
      navigate("/")
    }
  }, [isAdmin, navigate])

  return (
    <div>
      <h1>AdminDashboard Placeholder</h1>
      <p>
        This page has no functionality. You can use this page to centralize all admin operations
      </p>
      <nav className="flex justify-center">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <Button>
              <Link to="/admin">New Course</Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link to="/admin">New User</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default AdminDashboard
