# AGENTS.md

This document provides essential information for AI agents working on the CS Lab codebase.

## Project Overview

**CS Lab** is an educational platform for Computer Science students at Kasetsart University. It allows students to work through programming lab materials, submit code solutions, and track their progress. The platform includes both a student learning portal and a CMS admin panel for instructors.

- **Version**: 0.1.0
- **Repository**: Private
- **Author**: SornchaiTheDev

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16.0.10 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, CSS Modules (SASS) |
| **UI Components** | Radix UI primitives, Shadcn/ui |
| **Code Editor** | CodeMirror 6 |
| **Rich Text Editor** | TipTap 3 |
| **State Management** | Jotai (atoms), TanStack Query (React Query) |
| **Forms** | React Hook Form, Zod validation |
| **Animation** | Motion, Framer Motion |
| **Drag & Drop** | dnd-kit |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Package Manager** | pnpm 10.10.0 |

## Directory Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (authed)/        # Authenticated routes
│   │   ├── cms/         # Content Management System (admin)
│   │   └── (core)/      # Core learning features (student)
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   └── simple/          # Simple routes
├── assets/              # Static assets (fonts, images, icons, lotties)
├── components/          # Shared React components
│   ├── ui/              # Shadcn/ui components
│   ├── Editor/          # Code editor components
│   ├── Menus/           # Menu components
│   ├── commons/         # Shared components
│   ├── tiptap-*/        # TipTap rich text editor components
│   └── tiptap-node/     # TipTap editor nodes
├── constants/           # App constants
├── globalStore/         # Global Jotai atoms
├── hooks/               # Custom React hooks
├── layouts/             # Layout components
├── lib/                 # Utility functions and API clients
├── providers/           # React context providers
├── queryKeys/           # TanStack Query keys
├── schemas/             # Global Zod schemas
├── services/            # API service functions
└── types/               # Global TypeScript types
```

## Page-Specific File Organization

When adding features to a page, keep related code in co-located underscore-prefixed subdirectories. This pattern keeps page-specific code together and makes dependencies explicit.

```
src/app/(authed)/cms/(normal-layout)/labs/[labID]/
├── page.tsx              # Main page component
├── _components/          # Components ONLY used on this page
├── _schemas/             # Zod schemas ONLY for this page
├── _store/               # Jotai atoms ONLY for this page
├── _types/               # TypeScript types ONLY for this page
├── _hooks/               # Custom hooks ONLY for this page
├── _utils/               # Utility functions ONLY for this page
└── _configs/             # Configurations for this page
```

**Example**: If you need to add a new form on the labs page, create the schema in `_schemas/` and components in `_components/`.

## Path Aliases

The project uses TypeScript path aliases:

| Alias | Maps To |
|-------|---------|
| `~/*` | `./src/*` |

**Example imports**:
```typescript
import Button from "~/components/ui/button";
import { cn } from "~/lib/utils";
```

## API Integration

### API Proxy Configuration
All API requests to the backend server are proxied through Next.js. Configure proxy rewrites in `next.config.ts`:

- `/api/v1/*` → `${SERVER_API_URL}/:path*`

### Environment Variables
| Variable | Description |
|----------|-------------|
| `WEB_URL` | Frontend URL |
| `CLIENT_API_URL` | Client-side API base URL |
| `SERVER_API_URL` | Server-side API base URL |

### API Services
- **Services**: `src/services/` - Axios-based API service functions
- **Client utilities**: `src/lib/api.client.ts`
- **Server utilities**: `src/lib/api.server.ts`
- **Query keys**: `src/queryKeys/` - TanStack Query cache keys

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

## Docker

Multi-stage Dockerfile available for production deployment.

## Code Conventions

### Class Merging
Use the `cn()` utility from `~/lib/utils` for conditional class merging:
```typescript
import { cn } from "~/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />
```

### Zod Schemas
- **Global schemas**: `src/schemas/`
- **Page-specific schemas**: `_schemas/` within the page directory

### TanStack Query
Use query keys from `src/queryKeys/` for consistent cache management:
```typescript
import { queryKeys } from "~/queryKeys";
```

### UI Components
Shadcn/ui components are located in `src/components/ui/`. Follow the same pattern when creating new components.

### State Management
- **Global state**: Jotai atoms in `src/globalStore/`
- **Page-specific state**: Jotai atoms in `_store/` within the page directory
- **Server state**: TanStack Query with proper query keys

## Testing

**No test infrastructure currently set up.** The project lacks unit/integration tests. Consider adding a testing framework (Vitest, React Testing Library) if needed.

## Additional Resources

- **TODO.md**: Outstanding tasks and notes
- **next.config.ts**: Next.js configuration including API proxy rewrites
- **tsconfig.json**: TypeScript configuration with path aliases
- **components.json**: Shadcn/ui configuration
