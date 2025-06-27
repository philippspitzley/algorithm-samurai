import React from "react"

import { useAuth } from "@/context/auth/useAuth"

import { Button } from "./ui/button"

interface Props extends React.ComponentProps<typeof Button> {
  returnToCurrentPage?: boolean
  className?: string
  children?: React.ReactNode
}

function LoginButton({
  returnToCurrentPage = true,
  className,
  children = "Login",
  ...buttonProps
}: Props) {
  const { goToLogin } = useAuth()

  return (
    <Button onClick={() => goToLogin(returnToCurrentPage)} className={className} {...buttonProps}>
      {children}
    </Button>
  )
}

export default LoginButton
