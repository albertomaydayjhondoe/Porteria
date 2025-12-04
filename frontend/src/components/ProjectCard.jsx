import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Calendar, Activity } from 'lucide-react'
import { format } from 'date-fns'

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'in_development':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'in_development':
        return 'In Development'
      case 'completed':
        return 'Completed'
      default:
        return 'Planning'
    }
  }

  return (
    <div 
      className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
          {getStatusText(project.status)}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{project.collaborators || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity size={16} />
            <span>Active</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <span>{format(new Date(project.created_at), 'MMM dd')}</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard