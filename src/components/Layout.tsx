// src/components/Layout.tsx
import { Outlet } from "react-router-dom"

import Header from "./Header"

const Layout = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 bg-[url('/images/third.svg')] bg-cover bg-center bg-no-repeat dark:bg-[url('/images/sixth.svg')]">
        <main className="container mx-auto mt-5 max-w-4xl min-w-0 px-4 py-8">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default Layout
