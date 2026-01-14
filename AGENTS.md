# AGENTS.md - Innocean AI Frontend

> Guidelines for AI agents working in this Next.js 16 + React 19 codebase.

## Quick Reference

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` (Biome check) |
| Format | `npm run format` (Biome format --write) |
| Start prod | `npm run start` |

**No test framework configured.** No jest/vitest/playwright setup exists.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── login/              # Login page
│   ├── crawling/           # Crawling feature
│   │   └── _components/    # Page-specific components (underscore prefix)
│   └── api/                # API routes (proxy)
├── apis/                   # API hooks (TanStack Query mutations/queries)
├── components/
│   ├── ui/                 # Reusable UI primitives (shadcn/ui style)
│   ├── common/             # Shared components
│   ├── modals/             # Modal dialogs
│   ├── sidebar/            # Sidebar components
│   ├── main/               # Main content area
│   ├── chat/               # Chat feature
│   └── header/             # Header components
├── stores/                 # Zustand stores
├── lib/                    # Utilities (cn helper)
├── types/                  # TypeScript type definitions
├── data/                   # Static data
└── utils/                  # Utility functions
```

---

## Code Style Guidelines

### Linting & Formatting (Biome)

- **Biome** handles both linting and formatting (no ESLint/Prettier)
- Indent: 2 spaces
- Organize imports automatically enabled
- Run `npm run lint` to check, `npm run format` to auto-fix

### TypeScript

- **Strict mode** enabled
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017
- **Never use**: `as any`, `@ts-ignore`, `@ts-expect-error`

### Imports

```typescript
// 1. External packages first
import { create } from "zustand";
import { useMutation, useQuery } from "@tanstack/react-query";

// 2. Internal absolute imports (@/ alias)
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 3. Relative imports last (for same-directory)
import { http } from "./common";
```

### Components

```typescript
// Function declaration style (NOT arrow functions for components)
function ComponentName({ prop1, prop2 }: Props) {
  return <div>...</div>;
}

// Default export at bottom
export default ComponentName;

// Named exports for utilities
export { Button, buttonVariants };
```

### Component Patterns

- **UI primitives**: Use shadcn/ui pattern with `cva` for variants
- **"use client"** directive required for client components
- **Props**: Inline type with `React.ComponentProps<>` extension
- **Loading states**: Use `loading` prop pattern with Loader2 icon

```typescript
// UI component pattern (button.tsx style)
function Button({
  className,
  variant,
  size,
  loading = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
  loading?: boolean;
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : props.children}
    </button>
  );
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ChatInput.tsx`, `SessionList.tsx` |
| Hooks | camelCase with `use` prefix | `useSessionStore`, `useJobInfo` |
| Stores | camelCase with `Store` suffix | `authStore.ts`, `sessionStore.ts` |
| API hooks | `use` + Action + Resource | `useUpsertSessionInfo`, `useDeleteSession` |
| Types/Interfaces | PascalCase | `SessionInfo`, `AnalysisJob` |
| Page components | `_components/` directory | `app/crawling/_components/` |

### State Management (Zustand)

```typescript
// Store pattern
interface StoreState {
  value: string | null;
  setValue: (v: string) => void;
}

export const useMyStore = create<StoreState>((set) => ({
  value: null,
  setValue: (v) => set({ value: v }),
}));

// With persistence
export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({ /* state */ }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) }
  )
);
```

### API Layer (TanStack Query)

```typescript
// Query pattern
export const useSessionInfo = (sessionId: string | null) => {
  return useQuery<SessionInfo>({
    queryKey: ["/api/sessions/:session_id", { session_id: sessionId }],
    enabled: !!sessionId,
  });
};

// Mutation pattern with cache invalidation
export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (sessionId) => http.delete(`/api/sessions/${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });
};
```

### HTTP Client (`src/apis/common.ts`)

- Custom `http` wrapper with typed methods
- Error handling via `HttpError` class
- Methods: `get`, `post`, `put`, `patch`, `delete`, `multipart`

### Styling (Tailwind CSS v4)

- Use `cn()` utility for conditional classes
- CSS variables for theming (oklch colors)
- Dark mode via `.dark` class variant
- Custom animations in `globals.css`

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| Next.js 16 | App Router, Server Actions |
| React 19 | UI framework with React Compiler |
| TanStack Query | Server state management |
| Zustand | Client state management |
| Radix UI | Accessible UI primitives |
| Tailwind CSS v4 | Styling |
| react-hook-form + zod | Form handling & validation |
| lucide-react | Icons |
| sonner | Toast notifications |

---

## Common Gotchas

1. **No tests**: This codebase has no test framework configured
2. **React Compiler**: Enabled via `babel-plugin-react-compiler`
3. **Server Actions**: Body size limit set to 100mb
4. **Korean UI**: Most user-facing text is in Korean
5. **API proxy**: Routes through `/api/proxy/` or direct `NEXT_PUBLIC_API_URL`
