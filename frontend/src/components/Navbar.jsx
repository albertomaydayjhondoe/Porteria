import React from 'react'
import { User, Settings, LogOut } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary-600">ProjectHub</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-600" />
              <span className="text-sm font-medium">Admin User</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar