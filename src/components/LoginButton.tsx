import React from "react"

import { useAuth } from "@/context/auth/useAuth"

import { Button } from "./ui/button"

interface Props {
  returnToCurrentPage?: boolean
  className?: string
  children?: React.ReactNode
}

function LoginButton({ returnToCurrentPage = true, className, children = "Login" }: Props) {
  const { goToLogin } = useAuth()

  return (
    <Button onClick={() => goToLogin(returnToCurrentPage)} className={className}>
      {children}
    </Button>
  )
}

export default LoginButton
