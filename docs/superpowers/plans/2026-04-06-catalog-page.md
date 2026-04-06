# Catalog Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/catalog` page with dynamic category tabs, search bar, product grid, and load-more pagination — all fetching from the Prisma/PostgreSQL database.

**Architecture:** Client component page that fetches products from existing `/api/products` endpoint and a new `/api/products/categories` endpoint. Category tabs and search bar filter results; "Load More" appends the next page of results. Reuses existing `ProductCard`, `SectionWrapper`, and `Footer` components.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, Prisma ORM, PostgreSQL

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/app/api/products/categories/route.ts` | API: return distinct product categories from DB |
| Create | `src/app/catalog/page.tsx` | Catalog page with search, category tabs, product grid, load more |

Reused (no changes):
- `src/components/ProductCard.tsx` — individual product card
- `src/components/SectionWrapper.tsx` — section animation wrapper
- `src/components/Footer.tsx` — page footer
- `src/lib/prisma.ts` — Prisma client instance
- `src/app/api/products/route.ts` — existing products API with search/category/pagination

---

### Task 1: Categories API Endpoint

**Files:**
- Create: `src/app/api/products/categories/route.ts`

- [ ] **Step 1: Create the categories route handler**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.product.findMany({
      where: { status: "available" },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    return NextResponse.json(categories.map((c) => c.category));
  } catch (error) {
    console.error("GET /api/products/categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify endpoint works**

Run: `curl http://localhost:3000/api/products/categories`
Expected: JSON array of category strings, e.g. `["Bracelets","Earrings","Necklaces","Rings"]`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/products/categories/route.ts
git commit -m "feat: add categories API endpoint"
```

---

### Task 2: Catalog Page

**Files:**
- Create: `src/app/catalog/page.tsx`

- [ ] **Step 1: Create the catalog page component**

This is a `"use client"` page that:
1. Fetches categories from `/api/products/categories` on mount
2. Fetches products from `/api/products` with current filters (category, search, page)
3. Renders a header section, search input, category tabs, product grid, and load more button

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  pages: number;
  page: number;
}

const LIMIT = 12;

export default function CatalogPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products when filters change
  const fetchProducts = useCallback(
    async (pageNum: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams();
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (debouncedSearch) params.set("search", debouncedSearch);
      params.set("page", String(pageNum));
      params.set("limit", String(LIMIT));
      params.set("status", "available");

      try {
        const res = await fetch(`/api/products?${params}`);
        const data: ProductsResponse = await res.json();

        if (append) {
          setProducts((prev) => [...prev, ...data.products]);
        } else {
          setProducts(data.products);
        }
        setTotalPages(data.pages);
        setPage(data.page);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, debouncedSearch]
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleLoadMore = () => {
    fetchProducts(page + 1, true);
  };

  return (
    <main className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="px-6 pt-32 pb-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-xs tracking-[0.3em] uppercase text-gold-dark">
              Collection
            </p>
            <h1 className="font-serif text-4xl tracking-wide text-charcoal md:text-5xl lg:text-6xl">
              Our Catalog
            </h1>
            <div className="mx-auto mt-6 h-px w-16 bg-gold" />
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative mx-auto max-w-md">
              <svg
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-charcoal/10 bg-white py-3 pl-12 pr-4 text-sm tracking-wide text-charcoal placeholder:text-charcoal/40 outline-none transition-colors focus:border-gold"
              />
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-12 flex flex-wrap justify-center gap-2"
          >
            {["All", ...categories].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`relative rounded-full px-6 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-charcoal text-ivory"
                    : "bg-transparent text-charcoal/60 hover:text-charcoal"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 pb-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <p className="font-serif text-xl text-charcoal/40">
                No pieces found
              </p>
              <p className="mt-2 text-sm text-charcoal/30">
                Try adjusting your search or filter
              </p>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + debouncedSearch}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8"
                >
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      price={`$${product.price.toLocaleString()}`}
                      image={
                        product.imageUrl ||
                        "https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=600&q=80"
                      }
                      index={index}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Load More */}
              {page < totalPages && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-16 flex justify-center"
                >
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="group relative overflow-hidden rounded-full border border-charcoal/20 px-10 py-3 text-xs tracking-[0.2em] uppercase text-charcoal transition-all duration-500 hover:border-charcoal hover:bg-charcoal hover:text-ivory disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                        Loading
                      </span>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify the page renders**

Run: Open `http://localhost:3000/catalog` in browser.
Expected: Header with "Our Catalog", search bar, category tabs (All + dynamic categories), product grid from DB, Load More button if > 12 products.

- [ ] **Step 3: Test interactions**

1. Click a category tab → grid filters to that category
2. Type in search bar → grid updates after 300ms debounce
3. Click Load More → more products append to grid
4. Search with no results → "No pieces found" empty state

- [ ] **Step 4: Commit**

```bash
git add src/app/catalog/page.tsx
git commit -m "feat: add catalog page with search, category filter, and load more"
```

---

### Task 3: Link Catalog from Landing Page

**Files:**
- Modify: `src/components/CatalogPreview.tsx`

- [ ] **Step 1: Add a "View Full Catalog" link to CatalogPreview**

Add a Link import and a button at the bottom of the CatalogPreview section, after the horizontal scroll div:

```tsx
// Add import at top:
import Link from "next/link";

// Add after the closing </div> of the horizontal scroll container, before </SectionWrapper>:
<div className="mt-12 text-center">
  <Link
    href="/catalog"
    className="inline-block rounded-full border border-charcoal/20 px-10 py-3 text-xs tracking-[0.2em] uppercase text-charcoal transition-all duration-500 hover:border-charcoal hover:bg-charcoal hover:text-ivory"
  >
    View Full Catalog
  </Link>
</div>
```

- [ ] **Step 2: Verify the link works**

Run: Open `http://localhost:3000`, scroll to Signature Catalog section.
Expected: "View Full Catalog" button appears below the category cards. Clicking it navigates to `/catalog`.

- [ ] **Step 3: Commit**

```bash
git add src/components/CatalogPreview.tsx
git commit -m "feat: add link to full catalog from landing page"
```
