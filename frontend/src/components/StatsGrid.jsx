import React, { useState, useEffect } from 'react'
import { Folder, Users, GitBranch, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'

const StatsGrid = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCollaborators: 0,
    activeProjects: 0,
    totalCommits: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      // Fetch active projects count
      const { count: activeCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Fetch collaborators count
      const { count: collaboratorsCount } = await supabase
        .from('collaborators')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalProjects: projectsCount || 12,
        totalCollaborators: collaboratorsCount || 48,
        activeProjects: activeCount || 8,
        totalCommits: 2456 // This would come from Git API in real app
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback data
      setStats({
        totalProjects: 12,
        totalCollaborators: 48,
        activeProjects: 8,
        totalCommits: 2456
      })
    }
  }

  const statItems = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Folder,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Collaborators',
      value: stats.totalCollaborators,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Commits',
      value: stats.totalCommits.toLocaleString(),
      icon: GitBranch,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => {
        const Icon = item.icon
        return (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className={`${item.bgColor} p-3 rounded-lg`}>
                <Icon className={`${item.color}`} size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsGrid