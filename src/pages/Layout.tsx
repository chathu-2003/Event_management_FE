import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
        <Header />
        <main>
            <Outlet />
        </main>
    </div>
  )
}