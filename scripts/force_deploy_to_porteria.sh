#!/bin/bash

# 🚨 DESTRUCTIVE DEPLOYMENT SCRIPT 🚨
#
# This script will COMPLETELY REPLACE the content of the target repository
# with build artifacts from this project. ALL existing content will be LOST!
#
# 📋 Prerequisites:
# 1. Create a Personal Access Token (PAT) at: https://github.com/settings/tokens
# 2. Grant 'repo' scope to the PAT
# 3. Set the PAT as environment variable: export GITHUB_PAT="your_token_here"
# 4. OR save it in ~/.github_pat and source it before running
#
# 🎯 Target Repository: albertomaydayjhondoe/Porteria
# 💾 Backup: Automatic backup branch will be created before replacement
#
# Usage: ./scripts/force_deploy_to_porteria.sh [BUILD_DIR]
# Example: ./scripts/force_deploy_to_porteria.sh ./dist

set -euo pipefail

# Configuration
readonly TARGET_REPO="albertomaydayjhondoe/Porteria"
readonly TARGET_REPO_URL="https://github.com/${TARGET_REPO}.git"
readonly BUILD_DIR="${1:-./dist}"
readonly TEMP_DIR="/tmp/porteria-deploy-$(date +%s)"
readonly BACKUP_BRANCH="backup-before-force-deploy-$(date -u +%Y%m%dT%H%M%SZ)"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Cleanup function
cleanup() {
  if [[ -d "$TEMP_DIR" ]]; then
    log_info "Cleaning up temporary directory..."
    rm -rf "$TEMP_DIR"
  fi
}

# Set cleanup trap
trap cleanup EXIT

# Validation functions
validate_prerequisites() {
  log_info "Validating prerequisites..."
  
  # Check if git is installed
  if ! command -v git &> /dev/null; then
    log_error "git is not installed or not in PATH"
    exit 1
  fi
  
  # Check if build directory exists
  if [[ ! -d "$BUILD_DIR" ]]; then
    log_error "Build directory '$BUILD_DIR' does not exist"
    log_info "Run 'npm run build' first to generate build artifacts"
    exit 1
  fi
  
  # Check if build directory has content
  if [[ -z "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]]; then
    log_error "Build directory '$BUILD_DIR' is empty"
    log_info "Run 'npm run build' to generate build artifacts"
    exit 1
  fi
  
  # Check for GitHub PAT
  if [[ -z "${GITHUB_PAT:-}" ]]; then
    # Try to load from file
    if [[ -f ~/.github_pat ]]; then
      log_info "Loading GitHub PAT from ~/.github_pat"
      GITHUB_PAT=$(cat ~/.github_pat | tr -d '\n')
      export GITHUB_PAT
    else
      log_error "GitHub Personal Access Token not found"
      log_info "Set GITHUB_PAT environment variable or create ~/.github_pat file"
      log_info "Get your PAT at: https://github.com/settings/tokens"
      log_info "Required scope: 'repo'"
      exit 1
    fi
  fi
  
  log_success "Prerequisites validated"
}

# Display warning and get confirmation
confirm_deployment() {
  echo ""
  log_warning "🚨 DESTRUCTIVE OPERATION WARNING 🚨"
  echo ""
  echo -e "${RED}This script will:${NC}"
  echo "  🎯 Target: $TARGET_REPO"
  echo "  💥 DELETE all existing content in main branch"
  echo "  📦 Replace with contents from: $BUILD_DIR"
  echo "  🔄 Force push to overwrite main branch"
  echo ""
  echo -e "${GREEN}Safety measures:${NC}"
  echo "  💾 Backup branch will be created: $BACKUP_BRANCH"
  echo "  🔗 Backup URL: https://github.com/$TARGET_REPO/tree/$BACKUP_BRANCH"
  echo ""
  
  read -p "Type 'CONFIRM' to proceed: " confirmation
  if [[ "$confirmation" != "CONFIRM" ]]; then
    log_error "Deployment cancelled by user"
    exit 1
  fi
  
  log_success "Deployment confirmed"
}

# Configure git with authentication
configure_git() {
  log_info "Configuring git with authentication..."
  
  # Configure git user
  git config user.name "Deploy Script"
  git config user.email "deploy@local"
  
  # Configure authentication URL
  git config url."https://${GITHUB_PAT}@github.com/".insteadOf "https://github.com/"
  
  log_success "Git configuration completed"
}

# Clone and prepare target repository
prepare_target_repo() {
  log_info "Cloning target repository..."
  
  mkdir -p "$TEMP_DIR"
  cd "$TEMP_DIR"
  
  git clone --depth 1 "$TARGET_REPO_URL" porteria
  cd porteria
  
  # Fetch all branches to ensure we can create backup
  git fetch --unshallow
  
  log_success "Target repository cloned to $TEMP_DIR/porteria"
}

# Create backup branch
create_backup() {
  log_info "Creating backup branch: $BACKUP_BRANCH"
  
  cd "$TEMP_DIR/porteria"
  
  # Ensure we're on main branch
  git checkout main
  
  # Create and push backup branch
  git checkout -b "$BACKUP_BRANCH"
  git push origin "$BACKUP_BRANCH"
  
  log_success "Backup branch created and pushed"
  log_info "Backup URL: https://github.com/$TARGET_REPO/tree/$BACKUP_BRANCH"
  
  # Return to main branch
  git checkout main
}

# Clear repository content and copy new files
deploy_content() {
  log_info "Clearing target repository content..."
  
  cd "$TEMP_DIR/porteria"
  
  # Remove all content except .git
  find . -maxdepth 1 \
    ! -name '.git' \
    ! -name '.' \
    ! -name '..' \
    -exec rm -rf {} \; 2>/dev/null || true
  
  log_success "Target repository cleared"
  
  log_info "Copying build artifacts..."
  
  # Copy build artifacts
  cp -r "$(realpath "$BUILD_DIR")"/* .
  
  # Remove node_modules if accidentally copied
  if [[ -d "node_modules" ]]; then
    rm -rf node_modules
    log_info "Removed node_modules directory"
  fi
  
  # Count copied files
  file_count=$(find . -maxdepth 1 -type f | wc -l)
  log_success "Copied $file_count files from build directory"
}

# Commit and push changes
commit_and_push() {
  cd "$TEMP_DIR/porteria"
  
  # Check if there are changes to commit
  if git diff --quiet && git diff --cached --quiet; then
    log_warning "No changes detected, skipping deployment"
    return 0
  fi
  
  log_info "Committing changes..."
  
  git add .
  
  # Create commit message
  local commit_message="🚀 Force deploy Daily Paper Comics - $(date -u '+%Y-%m-%d %H:%M:%S UTC')

🔄 Automated deployment from daily-paper-comics repository
📦 Build artifacts deployed for GitHub Pages
🏗️ Source build directory: $BUILD_DIR

⚠️  This commit REPLACES all previous content
💾 Previous content backed up in: $BACKUP_BRANCH

🌐 Live URL: https://albertomaydayjhondoe.github.io/Porteria/"
  
  git commit -m "$commit_message"
  
  log_info "Force pushing to main branch..."
  git push --force origin HEAD:main
  
  log_success "Deployment completed successfully!"
}

# Display final summary
show_summary() {
  echo ""
  log_success "🎉 DEPLOYMENT COMPLETED! 🎉"
  echo ""
  echo -e "${GREEN}📋 Summary:${NC}"
  echo "  ✅ Target repository: $TARGET_REPO"
  echo "  ✅ Build artifacts deployed from: $BUILD_DIR"
  echo "  ✅ Backup created: $BACKUP_BRANCH"
  echo "  ✅ Main branch force updated"
  echo ""
  echo -e "${BLUE}🌐 URLs:${NC}"
  echo "  📱 Live site: https://albertomaydayjhondoe.github.io/Porteria/"
  echo "  💾 Backup: https://github.com/$TARGET_REPO/tree/$BACKUP_BRANCH"
  echo "  📂 Repository: https://github.com/$TARGET_REPO"
  echo ""
  log_info "GitHub Pages may take a few minutes to update"
}

# Main execution
main() {
  log_info "🚀 Starting force deployment to Porteria..."
  echo ""
  
  validate_prerequisites
  confirm_deployment
  configure_git
  prepare_target_repo
  create_backup
  deploy_content
  commit_and_push
  show_summary
}

# Handle errors
set -e
trap 'log_error "Script failed at line $LINENO"' ERR

# Execute main function
main "$@"