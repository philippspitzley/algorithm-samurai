import "./App.css"

import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import { ThemeProvider } from "@/context/theme/ThemeProvider"
import Course from "@/pages/Course"
import Courses from "@/pages/Courses"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"

import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/auth/AuthProvider"
import AdminDashboard from "./pages/admin/AdminDashboard"
import UserDashboard from "./pages/user/UserDashboard"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Header />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />}></Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/users/:userId" element={<UserDashboard />} />
              <Route path="/courses/:courseId" element={<Course />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
