# AGENTS.md

This file contains guidelines for agentic coding assistants working in this repository.

## Commands

### Available Scripts
- `yarn dev` - Start development server
- `yarn build` - Build production bundle
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

### Testing
No test framework is currently configured in this project.

## Code Style Guidelines

### Tech Stack
- Next.js 15 (App Router) with TypeScript
- React 18 with React Bootstrap 5
- React Hook Form + Yup for forms
- NextAuth for authentication
- CSS-in-JS via styled-components and SCSS

### Project Structure
```
src/
├── app/              # Next.js App Router pages with route groups
├── components/       # Reusable React components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── helpers/          # Helper functions
├── assets/           # Static assets and data
└── pages/            # Legacy pages (_app.tsx, _document.tsx)
```

### Imports
- Use `@/` alias for src imports: `import { Component } from '@/components/Component'`
- Use type-only imports where possible: `import type { ComponentProps } from '@/types'`
- External libraries first, then internal imports, grouped with blank lines

### Naming Conventions
- **Components**: PascalCase (e.g., `TextFormInput`, `EmpresaFormComponent`)
- **Functions/Variables**: camelCase (e.g., `addOrSubtractDaysFromDate`)
- **Custom Hooks**: `use` prefix camelCase (e.g., `useLocalStorage`, `useLayoutContext`)
- **Types/Interfaces**: PascalCase with `Type` suffix (e.g., `FormInputProps`, `LayoutState`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_PAGE_TITLE`)
- **Files**: kebab-case for utilities/components, PascalCase for type definitions when appropriate

### TypeScript
- Strict mode enabled in tsconfig.json
- Use `type` over `interface` for most types
- Use generic types with proper constraints: `<TFieldValues extends FieldValues = FieldValues>`
- Use `Readonly<{ children: ReactNode }>` for children prop type
- Always type function parameters and return values

### Components
- Functional components only
- Add `"use client"` directive at top of client components
- Extract component interfaces/types at file level
- Use `className` prop for CSS classes
- Prefer named exports for better debugging

### Form Handling
- Use React Hook Form with Yup validation
- Form schemas in `Schema.ts` or `Schemas.ts`
- Use `yupResolver` for integration
- Field validation: `{...register("fieldName"), isInvalid={!!errors.fieldName}}`
- Use `useFieldArray` for dynamic fields

### Error Handling
- Use `console.error(error)` for logging
- Throw errors with descriptive messages: `throw new Error('useLayoutContext can only be used within LayoutProvider')`
- Use try-catch for async operations in hooks
- Show notifications via `showNotification({ message, variant })` from context

### Styling
- Bootstrap 5 utility classes preferred
- `clsx` for conditional classes
- SCSS for component-specific styles
- Theme variants: `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light'`

### Files
- Type definitions: `types.ts` or `type.ts` per module
- Schemas: `Schema.ts` or `Schemas.ts`
- Data files: `data.ts`
- Context files: `use*Context.tsx` pattern
- Index files: `index.tsx` or `index.ts` for exports

### State Management
- React Context for app-wide state
- Custom hooks for reusable logic
- Local state via `useState`
- Side effects via `useEffect`

### Routing
- Next.js App Router with route groups `(admin)`, `(other)`
- Use `usePathname()` and `useRouter()` from `next/navigation`
- Client components require `"use client"` directive

### Code Style
- Single quotes for strings
- No semicolons (except in specific cases)
- Arrow functions for callbacks
- Destructuring for props extraction
- Early returns for conditional rendering
- Avoid inline functions in JSX (use useCallback when needed)

### Auth
- NextAuth v4 with credentials provider
- Auth config in `src/app/api/auth/[...nextauth]/options.ts`
- Use `signIn()` and `signOut()` from `next-auth/react`
- Middleware for route protection in `src/middleware.ts`
