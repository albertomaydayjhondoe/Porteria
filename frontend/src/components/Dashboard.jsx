import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import ProjectCard from './ProjectCard'
import StatsGrid from './StatsGrid'
import { supabase } from '../lib/supabase'

const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Fallback to sample data
      setProjects([
        {
          id: 1,
          name: 'Paperboy Comics',
          description: 'Daily comic strips platform',
          status: 'active',
          collaborators: 3,
          created_at: '2024-01-15'
        },
        {
          id: 2,
          name: 'Task Manager Pro',
          description: 'Advanced project management tool',
          status: 'in_development',
          collaborators: 5,
          created_at: '2024-01-10'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your projects and track progress</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700">
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : (
          filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No projects found</div>
          <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard