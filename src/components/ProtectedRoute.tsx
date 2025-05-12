import React from "react"

import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "../context/auth/useAuth"

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
