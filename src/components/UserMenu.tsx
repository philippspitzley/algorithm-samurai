import { Menu } from "lucide-react"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/context/auth/useAuth"

import LoginButton from "./LoginButton"

export default function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="border-accent/50 size-9 cursor-pointer rounded-full border-2">
          {isAuthenticated ? (
            <AvatarFallback className="bg-primary hover:bg-accent text-primary-foreground font-extrabold">
              {user?.user_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          ) : (
            <AvatarFallback>
              <Menu></Menu>
            </AvatarFallback>
          )}
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid place-items-center gap-2">
          <ThemeToggle />

          {isAuthenticated && (
            <>
              <Button asChild variant={"ghost"} className="w-full">
                <Link to="users/me">Profile</Link>
              </Button>
              <Button className="w-full" onClick={logout}>
                Logout
              </Button>
            </>
          )}
          {!isAuthenticated && <LoginButton className="w-full">Login</LoginButton>}
        </div>
      </PopoverContent>
    </Popover>
  )
}
