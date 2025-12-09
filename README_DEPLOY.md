# 🚀 Force Deployment to Porteria Repository

## ⚠️ DESTRUCTIVE OPERATION WARNING

This deployment system will **COMPLETELY REPLACE** all content in the target repository `albertomaydayjhondoe/Porteria` with build artifacts from this project. This is a **DESTRUCTIVE** operation that will **DELETE** all existing files except the `.git` directory.

## 🛡️ Safety Measures

- **Automatic Backup**: A backup branch is created before any destructive action
- **Confirmation Required**: Manual confirmation needed for deployment
- **Build Validation**: Ensures build artifacts exist before proceeding
- **Rollback Capability**: Previous content can be restored from backup branch

## 📋 Setup Instructions

### 1. Create Personal Access Token (PAT)

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name: `Daily Paper Comics Deploy`
4. Set expiration as needed
5. **Required scope**: `repo` (Full control of private repositories)
6. Click "Generate token"
7. **Copy the token immediately** (it won't be shown again)

### 2. Configure Token for GitHub Actions

1. Go to this repository's **Settings** → **Secrets and variables** → **Actions**
2. Click "New repository secret"
3. Name: `TARGET_REPO_PAT`
4. Value: Paste your PAT token
5. Click "Add secret"

### 3. Configure Token for Local Script

Choose one of these methods:

**Method A: Environment Variable**
```bash
export GITHUB_PAT="your_token_here"
```

**Method B: Save to File**
```bash
echo "your_token_here" > ~/.github_pat
```

## 🚀 Deployment Options

### Option 1: GitHub Actions (Recommended)

1. **Manual Trigger**:
   - Go to **Actions** tab in this repository
   - Select "🚀 Force Replace Deploy to Porteria" workflow
   - Click "Run workflow"
   - Type `CONFIRM` in the confirmation field
   - Click "Run workflow" button

2. **Automatic Trigger**:
   - Push changes to `main` branch
   - Workflow triggers automatically on changes to:
     - `src/**`
     - `public/**`
     - `package.json`
     - `vite.config.ts`

### Option 2: Local Script Execution

1. **Make script executable** (if not already):
   ```bash
   chmod +x scripts/force_deploy_to_porteria.sh
   ```

2. **Run the script**:
   ```bash
   # Use default build directory (./dist)
   ./scripts/force_deploy_to_porteria.sh
   
   # Or specify custom build directory
   ./scripts/force_deploy_to_porteria.sh ./build
   ```

3. **Follow prompts**:
   - Review the destructive operation warning
   - Type `CONFIRM` when prompted
   - Wait for completion

## 🔍 Pre-Deployment Checklist

- [ ] **Test locally**: Ensure `npm run build` works correctly
- [ ] **Verify build**: Check `./dist` directory contains expected files
- [ ] **PAT configured**: Token is set up with proper `repo` scope
- [ ] **Test repository**: Consider testing on a dummy repository first
- [ ] **Backup awareness**: Understand backup branch will be created
- [ ] **Confirm target**: Double-check target repository is correct

## 🧪 Testing on Dummy Repository

**Highly recommended** before deploying to production:

1. Create a test repository (e.g., `test-porteria-deploy`)
2. Update target repository in script/workflow temporarily
3. Run deployment to test repository
4. Verify everything works as expected
5. Restore original target repository configuration

## 📊 What Happens During Deployment

### GitHub Actions Workflow:
1. 🔍 Checkout source repository (`daily-paper-comics`)
2. 📦 Install Node.js and dependencies
3. 🏗️ Run `npm ci && npm run build`
4. 🎯 Checkout target repository (`Porteria`)
5. 💾 Create backup branch: `backup-before-force-deploy-YYYYMMDDTHHMMSSZ`
6. 🗑️ Delete all content except `.git`
7. 📋 Copy build artifacts from `./dist`
8. 📝 Commit changes with detailed message
9. 🚀 Force push to `main` branch

### Local Script:
- Same steps as workflow, but executed locally
- Additional validation and interactive confirmation
- Colored output for better visibility
- Automatic cleanup of temporary files

## 🌐 Post-Deployment

After successful deployment:

- **Live site**: https://albertomaydayjhondoe.github.io/Porteria/
- **Repository**: https://github.com/albertomaydayjhondoe/Porteria
- **Backup branch**: Available in target repository branches

GitHub Pages may take a few minutes to update after deployment.

## 🔧 Troubleshooting

### Common Issues:

**❌ Authentication Failed**
- Verify PAT token is correct and has `repo` scope
- Check secret name is exactly `TARGET_REPO_PAT`
- Ensure token hasn't expired

**❌ Build Directory Not Found**
- Run `npm run build` before deployment
- Verify `./dist` directory exists and has content

**❌ No Changes to Commit**
- Build artifacts are identical to current content
- Deployment skips unnecessary commit

**❌ Target Repository Access Denied**
- Check repository exists and is accessible
- Verify PAT has access to target repository
- Ensure repository isn't archived or restricted

### Recovery Options:

**Restore from Backup**:
```bash
# In target repository
git checkout backup-before-force-deploy-YYYYMMDDTHHMMSSZ
git checkout -b restore-main
git push origin restore-main
# Then merge or force push restore-main to main
```

**Manual Rollback**:
- Navigate to backup branch in GitHub
- Create new branch from backup
- Set as default branch or merge to main

## 📝 File Structure

```
daily-paper-comics/
├── .github/workflows/
│   └── force-replace-deploy.yml    # GitHub Actions workflow
├── scripts/
│   └── force_deploy_to_porteria.sh # Local deployment script
├── README_DEPLOY.md               # This file
└── dist/                          # Build artifacts (generated)
    ├── index.html
    ├── assets/
    └── ...
```

## 🚨 Final Reminders

1. **This is a DESTRUCTIVE operation** - all content will be replaced
2. **Always test first** with a dummy repository
3. **Verify build artifacts** before deployment
4. **Backup is automatic** but verify it's created successfully
5. **GitHub Pages** may take time to reflect changes
6. **Monitor deployment** through Actions tab or script output

---

**⚡ Ready to deploy? Follow the setup instructions above, then choose your preferred deployment method.**