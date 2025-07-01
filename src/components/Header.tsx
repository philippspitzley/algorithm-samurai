import { Link, NavLink } from "react-router-dom"

import UserMenu from "./UserMenu"

function Header() {
  return (
    <header className="flex justify-center px-8">
      <div className="bg-background fixed z-50 flex w-full items-center justify-between px-4 py-2">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <span className="font-samurai flex-1 translate-y-1 text-3xl uppercase">
            <Link to="/">AS</Link>
          </span>

          <div className="flex items-center gap-4 text-lg">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-primary/80 border-primary/20 border-b-2 ${isActive ? "text-primary/100 border-primary/100 border-b-2" : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `text-primary/80 border-primary/20 border-b-2 ${isActive ? "text-primary/100 border-primary/100 border-b-2" : ""}`
              }
            >
              Courses
            </NavLink>
          </div>

          <div className="flex flex-1 justify-end">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
