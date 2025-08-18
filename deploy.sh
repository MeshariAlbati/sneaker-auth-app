#!/bin/bash

# Sneaker Authentication App - Quick Deploy Script
# This script helps you deploy your app quickly

set -e

echo "🚀 Sneaker Authentication App - Quick Deploy"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "sneaker_model_production.pth" ]; then
    echo "❌ Error: sneaker_model_production.pth not found!"
    echo "Please run this script from the 'Sneaker project' directory"
    exit 1
fi

echo "✅ Model file found"

# Function to deploy with Docker
deploy_docker() {
    echo "🐳 Building Docker image..."
    docker build -t sneaker-auth .
    
    echo "🚀 Starting container..."
    docker run -d -p 8000:8000 --name sneaker-auth-container sneaker-auth
    
    echo "✅ Docker deployment complete!"
    echo "🌐 Your app is running at: http://localhost:8000"
    echo "🛑 To stop: docker stop sneaker-auth-container"
    echo "🗑️  To remove: docker rm sneaker-auth-container"
}

# Function to setup Git repository
setup_git() {
    echo "📁 Setting up Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        echo "# Sneaker Authentication App" > README.md
        echo "" >> README.md
        echo "AI-powered sneaker authentication for Nike Jordan 1 and Air Force 1." >> README.md
        echo "" >> README.md
        echo "## Quick Start" >> README.md
        echo "" >> README.md
        echo "\`\`\`bash" >> README.md
        echo "# Run with Docker" >> README.md
        echo "docker build -t sneaker-auth ." >> README.md
        echo "docker run -p 8000:8000 sneaker-auth" >> README.md
        echo "\`\`\`" >> README.md
        
        # Create .gitignore
        cat > .gitignore << EOF
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.env
.venv

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
frontend/dist/
frontend/build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Docker
.dockerignore
EOF
        
        git add .
        git commit -m "Initial commit: Sneaker authentication app"
        echo "✅ Git repository initialized"
    else
        echo "✅ Git repository already exists"
    fi
    
    echo ""
    echo "📝 Next steps for Git deployment:"
    echo "1. Create a repository on GitHub"
    echo "2. Run: git remote add origin YOUR_GITHUB_REPO_URL"
    echo "3. Run: git push -u origin main"
    echo "4. Use the GitHub repo URL for platform deployments"
}

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check Docker
    if command -v docker &> /dev/null; then
        echo "✅ Docker is installed"
    else
        echo "❌ Docker is not installed"
        echo "   Install from: https://docs.docker.com/get-docker/"
        return 1
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        echo "✅ Git is installed"
    else
        echo "❌ Git is not installed"
        echo "   Install from: https://git-scm.com/downloads"
        return 1
    fi
    
    # Check Node.js (for local frontend development)
    if command -v npm &> /dev/null; then
        echo "✅ Node.js/npm is installed"
    else
        echo "⚠️  Node.js/npm not found (needed for local frontend development)"
        echo "   Install from: https://nodejs.org/"
    fi
    
    return 0
}

# Main menu
main_menu() {
    echo ""
    echo "📋 Choose your deployment option:"
    echo "1. 🐳 Docker (Local deployment)"
    echo "2. 📁 Setup Git repository (For cloud deployments)"
    echo "3. 🔍 Check prerequisites"
    echo "4. 📖 View deployment guide"
    echo "5. ❌ Exit"
    echo ""
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            if check_prerequisites; then
                deploy_docker
            fi
            ;;
        2)
            setup_git
            ;;
        3)
            check_prerequisites
            ;;
        4)
            if [ -f "DEPLOYMENT_GUIDE.md" ]; then
                echo "📖 Opening deployment guide..."
                if command -v code &> /dev/null; then
                    code DEPLOYMENT_GUIDE.md
                elif command -v open &> /dev/null; then
                    open DEPLOYMENT_GUIDE.md
                else
                    echo "📄 Please open DEPLOYMENT_GUIDE.md to view the full guide"
                fi
            else
                echo "❌ DEPLOYMENT_GUIDE.md not found"
            fi
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            main_menu
            ;;
    esac
}

# Check if we can run the script
if ! check_prerequisites; then
    echo ""
    echo "❌ Please install the missing prerequisites and try again."
    exit 1
fi

# Run main menu
main_menu

echo ""
echo "🎉 Deployment process completed!"
echo "📚 For more deployment options, check DEPLOYMENT_GUIDE.md"
