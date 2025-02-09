import React from 'react'
import {Routes, Route, Outlet} from 'react-router-dom'

import NavBarMenu from '../components/NavBarMenu'
import Footer from '../components/Footer'
import MuseosList from '../pages/MuseosList'
import MuseoDetail from '../pages/MuseoDetail'

import '../styles/pages/VerMuseosLayout.scss'

function VerMuseosLayout() {

  return (
    <div>
        <NavBarMenu/>
        <Outlet />
        <Footer />
    </div>
  )
}

function VerMuseosRoutes() {
  return (
    <Routes>
      <Route element={<VerMuseosLayout />} >
        <Route index element={<MuseosList titulo="Todos los museos" />} />
        <Route path="CercaDeMi" element={<MuseosList titulo="Museos cerca de mi" />} />
        <Route path="Populares" element={<MuseosList titulo="Museos populares" />} />
        <Route path=':museoId' element={<MuseoDetail />} />
      </Route>
    </Routes>
  )
}

export {VerMuseosLayout} 
export default VerMuseosRoutes