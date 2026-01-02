import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/alumniNavbar/Navbar'

const MainLayout = () => {
  return (
    <>
    <Navbar/>
    
    <main>
        <Outlet/>
    </main>
   
    </>
  )
}

export default MainLayout