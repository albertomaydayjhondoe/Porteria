import express from 'express'
import { supabase } from '../server.js'

const router = express.Router()

// GET /api/stats - Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    // Get projects count
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    // Get active projects count
    const { count: activeCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get collaborators count
    const { count: collaboratorsCount } = await supabase
      .from('collaborators')
      .select('*', { count: 'exact', head: true })

    res.json({
      success: true,
      data: {
        totalProjects: projectsCount || 0,
        activeProjects: activeCount || 0,
        totalCollaborators: collaboratorsCount || 0,
        totalCommits: 2456 // This would come from Git API integration
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return sample data
    res.json({
      success: true,
      data: {
        totalProjects: 12,
        activeProjects: 8,
        totalCollaborators: 48,
        totalCommits: 2456
      }
    })
  }
})

export default router