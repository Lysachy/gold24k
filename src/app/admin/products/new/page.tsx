"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new item to your catalog
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
