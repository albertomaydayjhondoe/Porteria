#!/bin/bash

# 🚀 Project Dashboard - Setup Script
echo "🚀 Setting up Project Management Dashboard..."

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Setup Frontend
echo "📦 Installing frontend dependencies..."
cd frontend
cp .env.example .env
npm install
echo "✅ Frontend setup complete!"

# Setup Backend  
echo "📦 Installing backend dependencies..."
cd ../backend
cp .env.example .env
npm install
echo "✅ Backend setup complete!"

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your Supabase database using: database-schema.sql"
echo "2. Update .env files with your actual Supabase credentials"
echo "3. Start the development servers:"
echo ""
echo "   Frontend: cd frontend && npm run dev"
echo "   Backend:  cd backend && npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 Documentation: README-dashboard.md"