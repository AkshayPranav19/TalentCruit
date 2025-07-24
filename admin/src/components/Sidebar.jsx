import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='min h-screen bg-white border-r border-gray-200 '>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-50 cursor-pointer ${isActive ? 'bg-[#d9dae5] border-r-4 border-[#3D7FBE]':''}`}to={'/dashboard'}>
                <p className='font-medium text-gray-700'>Dashboard</p>
            </NavLink>

            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-50 cursor-pointer ${isActive ? 'bg-[#d9dae5] border-r-4 border-[#3D7FBE]':''}`}to={'/applicants'}>
                <p className='font-medium text-gray-700'>Applicants</p>
            </NavLink>
            
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-50 cursor-pointer ${isActive ? 'bg-[#d9dae5] border-r-4 border-[#3D7FBE]':''}`}to={'/interviews'}>
                <p className='font-medium text-gray-700'>Interviews</p>
            </NavLink>

            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-50 cursor-pointer ${isActive ? 'bg-[#d9dae5] border-r-4 border-[#3D7FBE]':''}`}to={'/questions'}>
                <p className='font-medium text-gray-700'>Questions</p>
            </NavLink>

            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-50 cursor-pointer ${isActive ? 'bg-[#d9dae5] border-r-4 border-[#3D7FBE]':''}`}to={'/metrics'}>
                <p className='font-medium text-gray-700'>Metrics</p>
            </NavLink>

    </div>
  )
}

export default Sidebar