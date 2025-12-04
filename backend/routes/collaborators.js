import express from 'express'
import { supabase } from '../server.js'

const router = express.Router()

// GET /api/collaborators - Get all collaborators
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')

    if (error) throw error
    
    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error fetching collaborators:', error)
    // Return sample data
    res.json({
      success: true,
      data: [
        { id: 1, name: 'Admin User', role: 'Project Manager', project_id: 1 },
        { id: 2, name: 'Sampayo', role: 'Developer', project_id: 1 },
        { id: 3, name: 'Designer', role: 'UI/UX Designer', project_id: 1 }
      ]
    })
  }
})

// GET /api/collaborators/project/:projectId - Get collaborators by project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params
    
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')
      .eq('project_id', projectId)

    if (error) throw error
    
    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error fetching project collaborators:', error)
    res.json({
      success: true,
      data: []
    })
  }
})

export default router