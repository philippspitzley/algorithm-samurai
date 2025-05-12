import { Link } from "react-router-dom"

import AvatarImg from "../assets/images/samurai-avatar.jpg"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ThemeToggle } from "./ui/theme-toggle"

function Header() {
  return (
    <header className="bg-secondary flex justify-center border-b px-8">
      <div className="flex w-2xl items-center justify-between py-2">
        <span className="font-samurai flex-1 translate-y-1 text-3xl uppercase">
          <Link to="/">AS</Link>
        </span>

        <div className="flex items-center gap-4">
          <Link to="/courses">Courses</Link>
          <Link to="/login">Login</Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 justify-end">
          <Avatar>
            <AvatarImage src={AvatarImg} />
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export default Header
