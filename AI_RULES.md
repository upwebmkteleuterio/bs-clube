# AI_RULES.md

## Tech stack

- **React 19 + TypeScript** are used to build the application UI with typed components, hooks, props, and domain models.
- **Vite** is the build tool and development server; keep Vite configuration in `vite.config.ts` and use the existing `@` alias for `src`.
- **React Router** (`react-router-dom`) provides client-side navigation; keep the route tree centralized in `src/App.tsx`.
- **Tailwind CSS 4** provides utility-first styling through the Vite plugin and `src/index.css`.
- **Zustand** manages shared client-side application state, including cross-page state that does not belong in a single component.
- **TanStack React Query** manages asynchronous server or service data, including caching, loading states, mutations, and refetching.
- **Lucide React** provides the application's interface icons as consistent, accessible React components.
- **Motion** provides purposeful page, component, and interaction animations; animations should support comprehension rather than distract.
- **clsx** and **tailwind-merge** are used together for conditional and conflict-safe Tailwind class composition.
- **Google GenAI** is the AI integration library; keep Gemini API access behind a safe application boundary and never expose secrets in committed client code.

## Project structure and implementation rules

- Keep all application source code under `src/`.
- Keep route declarations in `src/App.tsx`, page components in `src/pages/`, reusable UI in `src/components/`, shared layouts in `src/layouts/`, hooks in `src/hooks/`, services in `src/services/`, stores in `src/store/`, and shared types in `src/types/`.
- Use TypeScript for new source files. Prefer explicit domain types from `src/types/` over duplicated inline object shapes.
- Keep pages focused on composition and page-level behavior. Extract reusable or page-specific pieces into components rather than creating large monolithic pages.
- Use the existing service layer for data access. Components should not duplicate service calls or embed domain data-fetching logic when a service or hook already exists.

## Library usage rules

- Use **React** for component composition, local state, lifecycle behavior, and event handling. Prefer function components and hooks; do not add a new state library for local component state.
- Use **React Router** for navigation and route guards. Use links or router navigation APIs instead of manually changing `window.location`.
- Use **Tailwind CSS** for layout, spacing, responsive behavior, typography, colors, borders, and states. Prefer existing design tokens and shared styles over ad hoc inline styles or new CSS files.
- Use **shadcn/ui and the existing Radix-based components** for standard controls, dialogs, sheets, menus, forms, tabs, tables, and accessible interactive patterns. Do not edit generated shadcn/ui primitives; wrap or compose them in `src/components/` when customization is needed.
- Use **Lucide React** for interface icons. Do not add hand-drawn icon SVGs or another icon package unless a required icon is unavailable.
- Use **Zustand** for durable, cross-component client state such as authenticated user context, wallet state, or selections shared across routes. Keep ephemeral UI state in the closest component that owns it.
- Use **TanStack React Query** for asynchronous, cacheable, or server-backed data. Keep query keys stable and specific, and put request details in services or hooks rather than directly in presentation components.
- Use **clsx** and **tailwind-merge** when composing conditional Tailwind classes; avoid repeated string-concatenation patterns.
- Use **Motion** only for meaningful transitions and feedback. Respect reduced-motion preferences and avoid animating layout unnecessarily.
- Use **Google GenAI** only through a dedicated service or server-side boundary. Read credentials from environment configuration, never hard-code keys, and never expose private credentials to the browser.
- Use **canvas-confetti** only for celebratory success feedback, not as a general-purpose animation system.

## Quality and safety rules

- Preserve accessibility: use semantic HTML, keyboard-operable controls, visible focus states, labels for form fields, and appropriate dialog behavior.
- Keep user-facing copy and naming consistent with the existing Portuguese product experience unless the task explicitly requests another language.
- Avoid unnecessary dependencies and abstractions. Reuse installed libraries and existing components before introducing new packages.
- Validate and normalize data at external boundaries. Do not trust user input or external service responses, and do not render untrusted HTML as markup.
- Keep secrets, API keys, and private configuration out of source control and browser-exposed code.
- Before finishing a change, run the relevant TypeScript checks and verify that the affected route or component remains usable at mobile and desktop sizes.
