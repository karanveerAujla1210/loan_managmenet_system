#!/bin/bash

# NBFC Loan Management System - Installation Script
# This script sets up the complete development environment

set -e

echo "🏦 NBFC Loan Management System - Installation Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Node.js is installed
check_nodejs() {
    print_header "Checking Node.js installation..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        
        # Check if version is 18 or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js version 18 or higher is required. Current version: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if MongoDB is installed
check_mongodb() {
    print_header "Checking MongoDB installation..."
    
    if command -v mongod &> /dev/null; then
        MONGO_VERSION=$(mongod --version | head -n1)
        print_status "MongoDB is installed: $MONGO_VERSION"
    else
        print_warning "MongoDB is not installed locally. You can use Docker or install MongoDB manually."
        print_status "Docker setup will be available with 'npm run docker:up'"
    fi
}

# Check if Redis is installed
check_redis() {
    print_header "Checking Redis installation..."
    
    if command -v redis-server &> /dev/null; then
        REDIS_VERSION=$(redis-server --version)
        print_status "Redis is installed: $REDIS_VERSION"
    else
        print_warning "Redis is not installed locally. You can use Docker or install Redis manually."
        print_status "Docker setup will be available with 'npm run docker:up'"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Node.js dependencies..."
    
    if [ -f "package.json" ]; then
        npm ci
        print_status "Dependencies installed successfully"
    else
        print_error "package.json not found. Make sure you're in the correct directory."
        exit 1
    fi
}

# Setup environment files
setup_environment() {
    print_header "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_status "Environment file created from .env.example"
            print_warning "Please update .env file with your configuration"
        else
            print_error ".env.example file not found"
            exit 1
        fi
    else
        print_status "Environment file already exists"
    fi
}

# Create necessary directories
create_directories() {
    print_header "Creating necessary directories..."
    
    directories=("logs" "uploads" "backups" "coverage")
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_status "Created directory: $dir"
        else
            print_status "Directory already exists: $dir"
        fi
    done
}

# Setup database indexes
setup_database() {
    print_header "Setting up database..."
    
    print_status "Database setup will be handled automatically when the application starts"
    print_status "Run 'npm run migrate' to set up initial data"
    print_status "Run 'npm run seed' to populate with sample data"
}

# Install global dependencies
install_global_deps() {
    print_header "Checking global dependencies..."
    
    # Check if nodemon is installed globally
    if ! command -v nodemon &> /dev/null; then
        print_status "Installing nodemon globally..."
        npm install -g nodemon
    else
        print_status "nodemon is already installed"
    fi
    
    # Check if PM2 is installed globally (for production)
    if ! command -v pm2 &> /dev/null; then
        print_status "Installing PM2 globally..."
        npm install -g pm2
    else
        print_status "PM2 is already installed"
    fi
}

# Setup Git hooks (if in git repository)
setup_git_hooks() {
    if [ -d ".git" ]; then
        print_header "Setting up Git hooks..."
        
        if command -v husky &> /dev/null; then
            npx husky install
            print_status "Git hooks configured with Husky"
        else
            print_warning "Husky not found. Git hooks not configured."
        fi
    fi
}

# Run tests to verify installation
run_tests() {
    print_header "Running tests to verify installation..."
    
    if npm test; then
        print_status "All tests passed! Installation verified."
    else
        print_warning "Some tests failed. Please check the configuration."
    fi
}

# Display next steps
show_next_steps() {
    print_header "Installation Complete! 🎉"
    echo ""
    print_status "Next steps:"
    echo "1. Update .env file with your configuration"
    echo "2. Start MongoDB and Redis (or use Docker: npm run docker:up)"
    echo "3. Run database migrations: npm run migrate"
    echo "4. Seed sample data: npm run seed"
    echo "5. Start development server: npm run dev"
    echo ""
    print_status "Available commands:"
    echo "  npm run dev          - Start development server"
    echo "  npm run start        - Start production server"
    echo "  npm run test         - Run tests"
    echo "  npm run docker:up    - Start with Docker"
    echo "  npm run migrate      - Run database migrations"
    echo "  npm run seed         - Seed sample data"
    echo ""
    print_status "Documentation: Check README.md for detailed instructions"
}

# Main installation process
main() {
    print_header "Starting NBFC Loan Management System Installation..."
    echo ""
    
    check_nodejs
    check_mongodb
    check_redis
    install_dependencies
    setup_environment
    create_directories
    install_global_deps
    setup_git_hooks
    setup_database
    
    # Ask if user wants to run tests
    echo ""
    read -p "Do you want to run tests to verify installation? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_tests
    fi
    
    show_next_steps
}

# Run main function
main "$@"