"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import JsBarcode from "jsbarcode";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  status: string;
  weight: number | null;
  purity: string | null;
}

interface ProductResponse {
  products: Product[];
  total: number;
  pages: number;
  page: number;
}

const CATEGORIES = ["Ring", "Necklace", "Bracelet", "Earring", "Bar", "Coin", "Pendant", "Other"];

function skuToEan13(sku: string): string {
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = (hash * 31 + sku.charCodeAt(i)) % 1000000000000;
  }
  const digits12 = String(hash).padStart(12, "0").slice(0, 12);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits12[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return digits12 + checkDigit;
}

function downloadBarcode(sku: string, productName: string) {
  const canvas = document.createElement("canvas");
  const ean = skuToEan13(sku);
  JsBarcode(canvas, ean, {
    format: "EAN13",
    width: 2,
    height: 80,
    displayValue: true,
    fontSize: 14,
    margin: 10,
  });
  const link = document.createElement("a");
  link.download = `barcode-${sku}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function ProductTable() {
  const [data, setData] = useState<ProductResponse>({
    products: [],
    total: 0,
    pages: 0,
    page: 1,
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sellingId, setSellingId] = useState<string | null>(null);
  const [sellPrice, setSellPrice] = useState("");
  const [markingSold, setMarkingSold] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    params.set("page", String(page));

    try {
      const res = await fetch(`/api/products?${params}`);
      const json = await res.json();
      setData(json);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [search, category, status, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  async function handleSold(product: Product) {
    if (!sellPrice || isNaN(Number(sellPrice)) || Number(sellPrice) <= 0) return;
    setMarkingSold(true);
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, price: Number(sellPrice), status: "sold" }),
      });
      setSellingId(null);
      setSellPrice("");
      fetchProducts();
    } catch {
      // silently fail
    } finally {
      setMarkingSold(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    setDeleting(id);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch {
      // silently fail
    } finally {
      setDeleting(null);
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or SKU..."
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 font-medium text-gray-500">Product</th>
                <th className="px-5 py-3 font-medium text-gray-500">SKU</th>
                <th className="px-5 py-3 font-medium text-gray-500">Category</th>
                <th className="px-5 py-3 font-medium text-gray-500">Price</th>
                <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                <th className="px-5 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                data.products.map((product, i) => (
                  <React.Fragment key={product.id}>
                  <motion.tr initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.purity && (
                          <p className="text-xs text-gray-400">{product.purity} · {product.weight}g</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{product.category}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.status === "available"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {product.status === "available" && (
                          <button
                            onClick={() => { setSellingId(product.id); setSellPrice(""); }}
                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            Sold
                          </button>
                        )}
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => downloadBarcode(product.sku, product.name)}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-700"
                        >
                          Barcode
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                        >
                          {deleting === product.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                  {sellingId === product.id && (
                    <tr className="border-b border-gray-50 bg-amber-50/50">
                      <td colSpan={6} className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-amber-700">Harga Jual (Rp):</span>
                          <input
                            type="number"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                            placeholder="Masukkan harga..."
                            className="w-48 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSold(product)}
                            disabled={markingSold || !sellPrice}
                            className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
                          >
                            {markingSold ? "..." : "Konfirmasi"}
                          </button>
                          <button
                            onClick={() => { setSellingId(null); setSellPrice(""); }}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100"
                          >
                            Batal
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {data.total} product{data.total !== 1 && "s"} total
          </p>
          <div className="flex gap-1">
            {Array.from({ length: data.pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
