import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import CourseIntro from "@/components/Courses/CourseIntro"
import Courses from "@/components/Courses/Courses"
import { ThemeProvider } from "@/context/theme/ThemeProvider"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import SignUp from "@/pages/SignUp"

import Chapter from "./components/Chapter/Chapter"
import CourseLayout from "./components/Courses/CourseLayout"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/auth/AuthProvider"
import { UserCoursesProvider } from "./context/userCourses/UserCoursesProvider"
import AdminDashboard from "./pages/admin/AdminDashboard"
import UserDashboard from "./pages/user/UserDashboard"

const queryClient = new QueryClient()

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <UserCoursesProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/courses" element={<Courses />}></Route>

                  <Route element={<ProtectedRoute />}>
                    {/* AdminDashboard is a placeholder page to centralize all admin operations if needed*/}
                    <Route path="/admin" element={<AdminDashboard />} />

                    <Route path="/users/me" element={<UserDashboard />} />

                    <Route element={<CourseLayout />}>
                      <Route path="/courses/:courseId" element={<CourseIntro />} />
                      <Route path="/courses/:courseId/:chapterId" element={<Chapter />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </UserCoursesProvider>
          </AuthProvider>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
