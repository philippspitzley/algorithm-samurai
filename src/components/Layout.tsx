// src/components/Layout.tsx

import { Outlet } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"

import Header from "./Header"

const Layout = () => {
  return (
    <>
      <Header />
      <div className="bg-background h-50"></div>
      <div className="h-600 bg-[url('/images/light-bg.svg')] bg-cover bg-center bg-no-repeat dark:bg-[url('/images/dark-bg.svg')]">
        <main className="max-w-9xl container mx-auto min-w-0 px-4">
          <Outlet />

          <Toaster richColors position="bottom-right" closeButton />
        </main>
      </div>
    </>
  )
}

export default Layout
