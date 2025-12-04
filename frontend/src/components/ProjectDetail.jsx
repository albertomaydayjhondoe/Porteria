import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Calendar, Activity, GitBranch, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [collaborators, setCollaborators] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectDetails()
  }, [id])

  const fetchProjectDetails = async () => {
    try {
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (projectError) throw projectError

      // Fetch collaborators
      const { data: collaboratorsData, error: collaboratorsError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('project_id', id)

      if (collaboratorsError) throw collaboratorsError

      setProject(projectData)
      setCollaborators(collaboratorsData || [])
    } catch (error) {
      console.error('Error fetching project details:', error)
      // Fallback data
      setProject({
        id: id,
        name: 'Paperboy Comics Platform',
        description: 'A comprehensive platform for daily comic strips with user management, content publishing, and interactive features.',
        status: 'active',
        created_at: '2024-01-15',
        tech_stack: ['React', 'Node.js', 'Supabase', 'Tailwind CSS'],
        repository_url: 'https://github.com/albertomaydayjhondoe/Porteria'
      })
      setCollaborators([
        { id: 1, name: 'Admin User', role: 'Project Manager', avatar: null },
        { id: 2, name: 'Sampayo', role: 'Developer', avatar: null },
        { id: 3, name: 'Designer', role: 'UI/UX Designer', avatar: null }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Activity className="text-green-600" size={20} />
            <span className="text-sm font-medium text-gray-600">Status</span>
          </div>
          <p className="text-lg font-semibold mt-1 capitalize">{project.status.replace('_', ' ')}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Users className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-600">Collaborators</span>
          </div>
          <p className="text-lg font-semibold mt-1">{collaborators.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <GitBranch className="text-purple-600" size={20} />
            <span className="text-sm font-medium text-gray-600">Commits</span>
          </div>
          <p className="text-lg font-semibold mt-1">156</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Calendar className="text-orange-600" size={20} />
            <span className="text-sm font-medium text-gray-600">Created</span>
          </div>
          <p className="text-lg font-semibold mt-1">Jan 15, 2024</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tech Stack */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {(project.tech_stack || ['React', 'Node.js', 'Supabase']).map((tech, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Repository */}
          {project.repository_url && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Repository</h2>
              <a 
                href={project.repository_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 underline"
              >
                {project.repository_url}
              </a>
            </div>
          )}
        </div>

        {/* Collaborators */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {collaborator.avatar ? (
                    <img src={collaborator.avatar} alt={collaborator.name} className="w-full h-full rounded-full" />
                  ) : (
                    <Users size={20} className="text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{collaborator.name}</p>
                  <p className="text-sm text-gray-600">{collaborator.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail