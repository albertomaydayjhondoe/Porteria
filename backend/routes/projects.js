import express from 'express'
import { supabase } from '../server.js'

const router = express.Router()

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    // Return sample data if database is not configured
    res.json({
      success: true,
      data: [
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
      ]
    })
  }
})

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    
    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(404).json({
      success: false,
      error: 'Project not found'
    })
  }
})

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  try {
    const { name, description, status } = req.body
    
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description, status }])
      .select()

    if (error) throw error
    
    res.status(201).json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    })
  }
})

export default router