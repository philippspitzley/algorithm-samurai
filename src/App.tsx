import "./App.css"

import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import { ThemeProvider } from "@/context/theme/ThemeProvider"
import Courses from "@/pages/Courses"
import Index from "@/pages/Index"
import Login from "@/pages/Login"

import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/auth/AuthProvider"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Header />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
