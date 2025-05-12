import React from "react"

import { Navigate, useLocation } from "react-router-dom"

import { useAuth } from "../context/auth/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Loading...</div> // Or a spinner
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
