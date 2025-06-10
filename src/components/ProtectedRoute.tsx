import React from "react"

import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "../context/auth/useAuth"

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} />
  }

  return <Outlet />
}

export default ProtectedRoute
