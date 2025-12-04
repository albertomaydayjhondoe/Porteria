import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Support both repository names
const repoName = process.env.GITHUB_REPOSITORY ? 
  process.env.GITHUB_REPOSITORY.split('/')[1] : 
  'Porteria'

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})