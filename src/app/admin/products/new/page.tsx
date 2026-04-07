"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tambah Produk</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tambahkan produk baru ke katalog
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
