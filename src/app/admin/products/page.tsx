"use client";

import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";

export default function ProductsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Produk</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola katalog perhiasan
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          + Tambah Produk
        </Link>
      </div>

      <ProductTable />
    </div>
  );
}
