import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Routes
import projectsRouter from './routes/projects.js'
import collaboratorsRouter from './routes/collaborators.js'
import statsRouter from './routes/stats.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL || 'https://sxjwoyxwgmmsaqczvjpd.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4andveXh3Z21tc2FxY3p2anBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODQ4OTIsImV4cCI6MjA4MDE2MDg5Mn0.C7E_sRLVn9Uzfv3w-AzwuUQC0xB4Mfuq0aFfxrXK3s0'
)

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: ['http://localhost:3000', 'https://albertomaydayjhondoe.github.io'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/projects', projectsRouter)
app.use('/api/collaborators', collaboratorsRouter)
app.use('/api/stats', statsRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Project Dashboard API'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Project Dashboard API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      collaborators: '/api/collaborators',
      stats: '/api/stats',
      health: '/health'
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API available at: http://localhost:${PORT}`)
})