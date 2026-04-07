"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SoldProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  material: string | null;
  purity: string | null;
  weight: number | null;
  price: number;
  updatedAt: string;
}

interface Stats {
  total: number;
  available: number;
  sold: number;
  totalRevenue: number;
  soldProducts: SoldProduct[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function downloadCSV(products: SoldProduct[]) {
  const headers = ["No", "Tanggal", "SKU", "Nama Produk", "Kategori", "Material", "Kadar", "Berat (g)", "Harga (Rp)"];
  const rows = products.map((p, i) => [
    i + 1,
    formatDate(p.updatedAt),
    p.sku,
    p.name,
    p.category,
    p.material || "-",
    p.purity || "-",
    p.weight ?? "-",
    p.price,
  ]);

  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
  rows.push(["", "", "", "", "", "", "", "TOTAL", totalRevenue]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => {
        const str = String(cell);
        return str.includes(",") ? `"${str}"` : str;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `penjualan-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    available: 0,
    sold: 0,
    totalRevenue: 0,
    soldProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/stats")
      .then((res) => res.json())
      .then((data) => setStats({ ...data, soldProducts: data.soldProducts || [] }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Produk", value: stats.total, color: "bg-gray-900" },
    { label: "Tersedia", value: stats.available, color: "bg-emerald-600" },
    { label: "Terjual", value: stats.sold, color: "bg-amber-600" },
    { label: "Total Pendapatan", value: formatPrice(stats.totalRevenue), color: "bg-blue-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dasbor</h1>
      <p className="mt-1 text-sm text-gray-500">
        Ringkasan katalog perhiasan
      </p>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${card.color}`} />
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
            </div>
            <p className="mt-3 text-2xl font-semibold text-gray-900">
              {loading ? (
                <span className="inline-block h-8 w-20 animate-pulse rounded bg-gray-100" />
              ) : (
                card.value
              )}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Sales Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Faktur Penjualan</h2>
            <p className="text-sm text-gray-500">Daftar produk yang sudah terjual</p>
          </div>
          {stats.soldProducts.length > 0 && (
            <button
              onClick={() => downloadCSV(stats.soldProducts)}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download CSV
            </button>
          )}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 font-medium text-gray-500">No</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Tanggal</th>
                  <th className="px-5 py-3 font-medium text-gray-500">SKU</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Nama Produk</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Kategori</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Kadar</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Berat</th>
                  <th className="px-5 py-3 text-right font-medium text-gray-500">Harga</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : stats.soldProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                      Belum ada penjualan
                    </td>
                  </tr>
                ) : (
                  <>
                    {stats.soldProducts.map((product, i) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                      >
                        <td className="px-5 py-4 text-gray-500">{i + 1}</td>
                        <td className="px-5 py-4 text-gray-600">{formatDate(product.updatedAt)}</td>
                        <td className="px-5 py-4 font-mono text-xs text-gray-500">{product.sku}</td>
                        <td className="px-5 py-4 font-medium text-gray-900">{product.name}</td>
                        <td className="px-5 py-4 text-gray-600">{product.category}</td>
                        <td className="px-5 py-4 text-gray-600">{product.purity || "-"}</td>
                        <td className="px-5 py-4 text-gray-600">{product.weight ? `${product.weight}g` : "-"}</td>
                        <td className="px-5 py-4 text-right font-medium text-gray-900">{formatPrice(product.price)}</td>
                      </motion.tr>
                    ))}
                    {/* Total Row */}
                    <tr className="border-t-2 border-gray-200 bg-gray-50">
                      <td colSpan={7} className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                        TOTAL
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-gray-900">
                        {formatPrice(stats.totalRevenue)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
