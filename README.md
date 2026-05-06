# Next.js Admin Dashboard

A modern admin dashboard built with **Next.js 14**, **Material UI**, **Zustand**, and **NextAuth.js**, powered by the [DummyJSON](https://dummyjson.com/) public API.

---

## Features

- ✅ Authentication with NextAuth.js (JWT strategy)
- ✅ Protected dashboard routes via middleware
- ✅ Users list with pagination, search, and detail view
- ✅ Products list with pagination, search, category filter, and detail view
- ✅ Zustand global state management with async actions
- ✅ Client-side caching to avoid repeat API calls
- ✅ Fully responsive MUI layout
- ✅ Performance: `React.memo`, `useCallback`, `useMemo`, debounced search

---

## Setup & Installation

### 1. Clone or unzip the project

```bash
cd nextjs-admin-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root (already included):

```env
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

> Change `NEXTAUTH_SECRET` to any long random string in production.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Login Credentials

| Field    | Value       |
|----------|-------------|
| Username | `emilys`    |
| Password | `emilyspass`|

These come from the DummyJSON API: `POST https://dummyjson.com/auth/login`

---

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts   # NextAuth API handler
│   ├── login/page.tsx                    # Login page
│   ├── dashboard/
│   │   ├── layout.tsx                    # Sidebar + AppBar layout
│   │   ├── users/
│   │   │   ├── page.tsx                  # Users list
│   │   │   └── [id]/page.tsx             # Single user detail
│   │   └── products/
│   │       ├── page.tsx                  # Products grid
│   │       └── [id]/page.tsx             # Single product detail
│   ├── layout.tsx                        # Root layout
│   └── providers.tsx                     # SessionProvider + ThemeProvider
├── store/index.ts                        # Zustand stores (users + products)
├── theme/index.ts                        # MUI custom theme
└── middleware.ts                         # Route protection
```

---

## Why Zustand?

- **Simplicity**: No reducers, actions, or boilerplate — just a plain function with `set`
- **Small footprint**: ~1KB gzipped vs Redux's much larger bundle
- **Built-in async**: Async API calls work directly inside store actions
- **Persistence**: Works seamlessly with `zustand/middleware` for localStorage caching
- **Better than Redux** for small-to-medium apps that don't need a complex event bus

---

## Caching Strategy

Results are cached in Zustand using a dictionary keyed by `page_search_category`. Before making an API call, the store checks if the result already exists in the cache. If it does, it returns immediately without hitting the network.

This is persisted to `localStorage` via Zustand's `persist` middleware, so cache survives page refreshes.

**Why caching is useful**: Avoids redundant network requests when users navigate back to a page they've already visited, improving perceived performance significantly.

---

## Build for Production

```bash
npm run build
npm start
```
