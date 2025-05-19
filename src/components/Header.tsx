import { Link } from "react-router-dom"

import { useAuth } from "@/context/auth/useAuth"

import AvatarImg from "../assets/images/samurai-avatar.jpg"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"

function Header() {
  const { logout, isAuthenticated, user } = useAuth()

  return (
    <header className="flex justify-center px-8">
      <div className="bg-background fixed z-50 flex w-full items-center justify-between py-2">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <span className="font-samurai flex-1 translate-y-1 text-3xl uppercase">
            <Link to="/">AS</Link>
          </span>

          <div className="flex items-center gap-4">
            {isAuthenticated && <Button onClick={logout}>Logout</Button>}
            {!isAuthenticated && (
              <Button>
                <Link to="/login">Login</Link>
              </Button>
            )}
            <ThemeToggle />
          </div>

          <div className="flex flex-1 justify-end">
            <Avatar>
              <AvatarImage src={AvatarImg} />
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>

            <Link to="/courses">Courses</Link>

            {isAuthenticated && <Link to={`/users/${user?.id}`}>User</Link>}

            {user?.is_superuser && <Link to="/admin">Admin</Link>}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
