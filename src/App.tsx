import "./App.css"

import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import { ThemeProvider } from "@/context/theme/ThemeProvider"
import Course from "@/pages/Course"
import Courses from "@/pages/Courses"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"

import Layout from "./components/Layout" // Import the Layout component
import NewCourseForm from "./components/NewCourseForm" // Added missing import
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/auth/AuthProvider"
import AdminDashboard from "./pages/admin/AdminDashboard"
import UserDashboard from "./pages/user/UserDashboard"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              {/* Layout Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />}></Route>
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/new-course" element={<NewCourseForm />} />
                <Route path="/users/:userId" element={<UserDashboard />} />
                <Route path="/courses/:courseId" element={<Course />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Routes outside the main layout come here*/}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
