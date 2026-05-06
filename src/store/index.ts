/**
 * Zustand Store — chosen for its simplicity, small bundle size,
 * and built-in async action support. No boilerplate like Redux.
 * Perfect for small-to-medium apps like this dashboard.
 *
 * Three slices:
 *  1. useAuthStore     — authentication state + token (persisted to localStorage)
 *  2. useUsersStore    — users list, pagination, search, cache
 *  3. useProductsStore — products list, pagination, search, category, cache
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  token: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  image: string;
  company: { name: string; title: string; department: string };
  address: { city: string; state: string; country: string };
  age: number;
  username: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// ─── 1. Auth Store ────────────────────────────────────────────────────────────
// Persisted to localStorage so the token survives page refreshes.

interface AuthState {
  authUser: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authUser: null,
      token: null,

      login: async (username: string, password: string) => {
        const res = await axios.post("https://dummyjson.com/auth/login", {
          username,
          password,
          expiresInMins: 60,
        });
        const data = res.data;
        // Store token in Zustand state (also persisted to localStorage automatically)
        set({ authUser: data, token: data.token });
      },

      logout: () => {
        set({ authUser: null, token: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-store");
        }
      },
    }),
    {
      name: "auth-store", // localStorage key
      partialize: (s) => ({ authUser: s.authUser, token: s.token }),
    }
  )
);

// ─── 2. Users Store ───────────────────────────────────────────────────────────

interface UsersState {
  users: User[];
  totalUsers: number;
  usersPage: number;
  usersSearch: string;
  /**
   * Caching strategy: key = "page_search" → avoids repeat API calls.
   * Persisted to localStorage via Zustand persist middleware.
   * Why useful: navigating back to a previously visited page returns instantly.
   */
  usersCache: Record<string, { users: User[]; total: number }>;
  fetchUsers: (page: number, search?: string) => Promise<void>;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [],
      totalUsers: 0,
      usersPage: 1,
      usersSearch: "",
      usersCache: {},

      fetchUsers: async (page: number, search = "") => {
        const limit = 10;
        const skip = (page - 1) * limit;
        const cacheKey = `${page}_${search}`;

        // Return cached data if available — avoids unnecessary API hits
        const cached = get().usersCache[cacheKey];
        if (cached) {
          set({
            users: cached.users,
            totalUsers: cached.total,
            usersPage: page,
            usersSearch: search,
          });
          return;
        }

        try {
          const url = search
            ? `https://dummyjson.com/users/search?q=${search}&limit=${limit}&skip=${skip}`
            : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

          const res = await axios.get(url);
          const { users, total } = res.data;

          set((state) => ({
            users,
            totalUsers: total,
            usersPage: page,
            usersSearch: search,
            usersCache: { ...state.usersCache, [cacheKey]: { users, total } },
          }));
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      },
    }),
    {
      name: "users-store",
      partialize: (s) => ({ usersCache: s.usersCache }),
    }
  )
);

// ─── 3. Products Store ────────────────────────────────────────────────────────

interface ProductsState {
  products: Product[];
  totalProducts: number;
  productsPage: number;
  productsSearch: string;
  productsCategory: string;
  categories: string[];
  /**
   * Caching strategy: key = "page_search_category" → avoids repeat API calls.
   * Persisted to localStorage via Zustand persist middleware.
   * Why useful: switching between categories or pages re-uses cached results.
   */
  productsCache: Record<string, { products: Product[]; total: number }>;
  fetchProducts: (page: number, search?: string, category?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      totalProducts: 0,
      productsPage: 1,
      productsSearch: "",
      productsCategory: "",
      categories: [],
      productsCache: {},

      fetchProducts: async (page: number, search = "", category = "") => {
        const limit = 12;
        const skip = (page - 1) * limit;
        const cacheKey = `${page}_${search}_${category}`;

        // Return cached data if available — avoids unnecessary API hits
        const cached = get().productsCache[cacheKey];
        if (cached) {
          set({
            products: cached.products,
            totalProducts: cached.total,
            productsPage: page,
            productsSearch: search,
            productsCategory: category,
          });
          return;
        }

        try {
          let url = "";
          if (search) {
            url = `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}`;
          } else if (category) {
            url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
          } else {
            url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
          }

          const res = await axios.get(url);
          const { products, total } = res.data;

          set((state) => ({
            products,
            totalProducts: total,
            productsPage: page,
            productsSearch: search,
            productsCategory: category,
            productsCache: {
              ...state.productsCache,
              [cacheKey]: { products, total },
            },
          }));
        } catch (err) {
          console.error("Failed to fetch products:", err);
        }
      },

      fetchCategories: async () => {
        // Already cached in memory — no need to re-fetch
        if (get().categories.length > 0) return;
        try {
          const res = await axios.get("https://dummyjson.com/products/categories");
          const cats = res.data.map((c: any) =>
            typeof c === "string" ? c : c.slug
          );
          set({ categories: cats });
        } catch (err) {
          console.error("Failed to fetch categories:", err);
        }
      },
    }),
    {
      name: "products-store",
      partialize: (s) => ({
        productsCache: s.productsCache,
        categories: s.categories,
      }),
    }
  )
);
