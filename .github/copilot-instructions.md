# Porteria - AI Coding Agent Instructions

## Project Overview

Daily comic strip viewer ("Porteria") - a React/TypeScript SPA deployed to GitHub Pages that displays comic strips with multimedia support (images, videos, audio). Uses Supabase for backend storage and admin authentication.

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui components (Radix UI primitives) + Tailwind CSS
- **State**: React hooks (no global state library)
- **Backend**: Static JSON files (no Supabase required)
- **Admin**: Local CLI script (`admin.mjs`)
- **Deployment**: GitHub Pages with base path `/Porteria/`

### Key Directories
- `src/pages/` - Route components (Index, Archive, About, Admin, NotFound)
- `src/components/` - Reusable components (StripViewer, HorizontalStripViewer, etc.)
- `src/components/ui/` - shadcn/ui primitives (DO NOT manually edit - use CLI)
- `public/data/` - JSON database for comic strips
- `public/strips/` - Static media files (images, videos, audio)
- `admin.mjs` - CLI admin tool for managing strips locally
- `src/pages/Admin.tsx` - Web admin panel for uploading videos/images

## Critical Patterns

### 1. GitHub Pages SPA Routing
The app uses a specialized routing setup for GitHub Pages with the base path `/Porteria/`:

```tsx
// App.tsx - Base path MUST match repo name
<BrowserRouter basename="/Porteria">

// vite.config.ts - Base path changes based on mode
base: mode === 'production' ? '/Porteria/' : '/',
```

**SPA 404 Redirect**: `index.html` contains a script that redirects 404s to the app, and `main.tsx` restores the original URL from `sessionStorage`. This enables direct navigation to routes like `/archivo`.

### 2. Static Data Loading

Comics are loaded from `public/data/strips.json`:

```typescript
// src/pages/Index.tsx & Archive.tsx
const response = await fetch('/Porteria/data/strips.json');
const data = await response.json();
setStrips(data.strips || []);
```

**Fallback handling**: If JSON fails to load, components show a fallback strip to prevent blank pages.

**Data structure**: See `public/data/strips.json` - each strip has `id`, `title`, `image_url`, `publish_date`, `media_type`, and optional `video_url`/`audio_url`.

### 3. Media Type Detection

Comic strips support 3 media types: `image`, `video`, `audio`. Detection logic in `StripViewer.tsx`:

```typescript
const getMediaType = (strip: ComicStrip): 'image' | 'video' | 'audio' => {
  if (strip.media_type) return strip.media_type;
  if (strip.video_url || strip.image_url?.endsWith('.mp4')) return 'video';
  if (strip.audio_url || strip.image_url?.match(/\.(mp3|wav|ogg)$/)) return 'audio';
  return 'image';
};
```

Use this pattern consistently across all strip-rendering components.

### 4. Component Library (shadcn/ui)

**NEVER manually edit files in `src/components/ui/`**. These are managed by shadcn CLI:

```bash
npx shadcn@latest add <component-name>  # Add new component
```

For customizations, wrap UI components in new components in `src/components/`.

### 5. Admin System (Dual Options)

**Option A - Local CLI** (`admin.mjs`):
```bash
node admin.mjs add --title "New Strip" --image "strip-003.png"  # Add strip
node admin.mjs list                                             # List all
node admin.mjs remove --id "abc123"                             # Remove strip
```

**Option B - Web Admin** (`/admin` route):
- Visual interface for uploading videos/images
- Uses GitHub API to upload files directly to repo
- Authenticates with GitHub Personal Access Token
- Automatically updates `strips.json` and triggers deployment
- Access at: `https://albertomaydayjhondoe.github.io/Porteria/admin`

See `ADMIN_LOCAL.md` (CLI) or `ADMIN_WEB.md` (Web) for complete documentation.

## Development Workflows

### Local Development
```bash
npm run dev              # Start dev server on :8080
npm run build            # Production build
npm run build:dev        # Dev build with source maps
npm run preview          # Preview production build
```

### Deployment

**Primary method**: GitHub Actions workflow pushes to `albertomaydayjhondoe/Porteria` repo.

**Manual deployment** (if needed):
```bash
npm run build                    # Build to /dist
./scripts/force_deploy_to_porteria.sh dist  # Deploy script
```

The `force_deploy_to_porteria.sh` script creates backup branches automatically before replacing content.

### Adding New Strips

Use the admin CLI to manage content:

```bash
# Add a new strip
node admin.mjs add --title "My Strip" --image "strip-004.png" --date "2025-12-11"

# Copy your file to public/strips/
cp your-image.png public/strips/strip-004.png

# Commit and push (auto-deploys via GitHub Actions)
git add . && git commit -m "Add new strip" && git push
```

No database setup needed - everything is in `public/data/strips.json`.

## Common Pitfalls

1. **Base path issues**: Always test routes with `/Porteria/` prefix in production builds
2. **JSON path**: Fetch from `/Porteria/data/strips.json` (not `/data/strips.json`)
3. **Media type handling**: Use `getMediaType()` pattern, don't hardcode assumptions
4. **UI component edits**: Don't modify `src/components/ui/` files directly
5. **404 handling**: The SPA redirect logic requires both `404.html` and session storage handling in `main.tsx`
6. **Admin script**: Always run from project root: `node admin.mjs` (not from subdirectories)

## Key Files to Reference

- `src/App.tsx` - Routing setup with basename
- `src/pages/Admin.tsx` - Web admin with GitHub API integration for file uploads
- `src/components/StripViewer.tsx` - Media type detection & rendering
- `admin.mjs` - CLI admin script for local management
- `vite.config.ts` - Build configuration with mode-based base path
- `scripts/force_deploy_to_porteria.sh` - Deployment script with backup logic

## Testing Considerations

No formal test suite currently. Manual testing checklist:
- Test all routes with `/Porteria/` base path
- Test JSON loading from `public/data/strips.json`
- Test video/audio rendering with different media types
- Test direct route navigation (404 redirect flow)
- Test admin CLI: `node admin.mjs list` and `node admin.mjs add`
