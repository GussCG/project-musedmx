import React from 'react'

import { Outlet } from 'react-router'
import NavBarMenu from '../components/NavBarMenu'
import Footer from '../components/Footer'

function AuthLayout() {
  return (
    <div>
      <NavBarMenu />
      <Outlet />
      <Footer />
    </div>
  )
}

export default AuthLayout