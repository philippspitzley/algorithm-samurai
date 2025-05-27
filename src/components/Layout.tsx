// src/components/Layout.tsx
import { Outlet } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"

import Header from "./Header"

const Layout = () => {
  return (
    <>
      <Header />
      <div className="h-600 bg-[url('/images/third.svg')] bg-cover bg-center bg-no-repeat dark:bg-[url('/images/sixth.svg')]">
        <main className="max-w-9xl container mx-auto mt-40 min-w-0 px-4 py-8">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </>
  )
}

export default Layout
